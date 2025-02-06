import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { FactureAchatService } from 'src/app/core/services/facture-achat.service';
import { FournisseurService } from 'src/app/core/services/fournisseur.service';
import { ReceptionAchatService } from 'src/app/core/services/reception-achat.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import  pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-facture-achat',
  templateUrl: './facture-achat.component.html',
  styleUrls: ['./facture-achat.component.scss']
})
export class FactureAchatComponent {

  factures: any[] = [];
    fournisseurs: any[] = [];
    addForm: FormGroup;
    editForm: FormGroup;
    idFournisseur:number
    selectedFacture: any; // pour stocker le module sélectionné pour l'édition
    p: number = 1; // Current page number
    itemsPerPage: number = 5;
    searchArticle: string = '';
    user: any;
    userType: string | null = '';
    private errorMessage: string = '';
    fileStatus={ status:'',requestType:'',percent:0 };
    attachementName:string;
    crmPermissions: any;
    isDropdownOpen: boolean = false;
  
    @ViewChild('add', { static: false }) add?: ModalDirective;
    @ViewChild('edit', { static: false }) edit?: ModalDirective;
  
    constructor(
      private factureService: FactureAchatService,
      private fb: FormBuilder,
      private entrepriseService: EntrepriseService,
      private employeService: EmployeService,
      private adminService: AdminSessionService,
      private fournisseurService: FournisseurService,
      private receptionService:ReceptionAchatService
    ) {
      this.addForm = this.fb.group({
        numFacture: ['', Validators.required],
        produits: this.fb.array([]),
        idFournisseur: [null, Validators.required], 
        priceHt: [{ value: 0, disabled: true }],
        tva: [0, Validators.required],
        taxe: [{ value: 0, disabled: true }],
        netApayer: [{ value: 0, disabled: true }],

      });
  
      this.editForm = this.fb.group({
        numFacture: ['', Validators.required],
        produits: this.fb.array([]),
        idFournisseur: [null, Validators.required], 
        priceHt: [{ value: 0, disabled: true }],
        tva: [0, Validators.required],
        taxe: [{ value: 0, disabled: true }],
        netApayer: [{ value: 0, disabled: true }],
      });
    }
  
    ngOnInit(): void {
      this.userType = localStorage.getItem('userType');
      const userEmail = localStorage.getItem('userMail');
  
      if (this.userType && userEmail) {
        if (this.userType === 'admin') {
            this.fetchAdminProfile(userEmail);
        } else if (this.userType === 'entreprise') {
            this.fetchEntrepriseProfile(userEmail);
        } else if (this.userType === 'employe') {
            this.fetchEmployeProfile(userEmail);
        } else {
            this.errorMessage = "Type d'utilisateur invalide.";
        }
      } else {
          this.errorMessage = 'Informations utilisateur introuvables dans le stockage local.';
      }
  
    }
  
    private fetchAdminProfile(email: string): void {
      this.adminService.getAdminByEmail(email).subscribe(
        (data) => {
          this.user = data;
        },
        (error) => {
          console.error('Error fetching user data', error);
          this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
        }
      );
    }
  
    private fetchEntrepriseProfile(email: string): void {
      this.entrepriseService.getEntrepriseByEmail(email).subscribe(
        (data) => {
          this.user = data;
        },
        (error) => {
          console.error('Error fetching worker data', error);
          this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
        }
      );
    }
  
    private fetchEmployeProfile(email: string): void {
      this.employeService.getEmployeByEmail(email).subscribe(
        (data) => {
          this.user = data;
          this.getAllFacture(data.entreprise.id);
          this.getAllfournisseur(data.entreprise.id);
          this.crmPermissions = this.getCRMPermissions(data);
    if (this.crmPermissions) {
      console.log('CRM Permissions:', this.crmPermissions);
      // You can use these permissions to control UI elements or functionality
    } else {
      console.log('No CRM module found for this user.');
    }
        },
        (error) => {
          console.error('Error fetching worker data', error);
          this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
        }
      );
    }
  
    getAllFacture(idEnt: number): void {
      this.factureService.getFacturesByEntrepriseId(idEnt).subscribe(factures => {
        this.factures = factures;
      });
    }
  
    getAllfournisseur(idEnt: number): void {
      this.fournisseurService.getFournisseursByEntrepriseId(idEnt).subscribe(fournisseurs => {
        this.fournisseurs = fournisseurs;
      });
    }
  
    addModal(): void {
      this.addForm.reset();
      this.addForm.setControl('produits', this.fb.array([]));
      this.addProduct(); // Start with one product entry
      this.add?.show();
    }
  
    addProduct(): void {
      const productForm = this.fb.group({
        nom: ['', Validators.required],
        quantite: [1, [Validators.required, Validators.min(1)]],
        prixUnitaire: [0, [Validators.required, Validators.min(0)]],
        prix_total: [{ value: 0, disabled: true }],
      });
      (this.addForm.get('produits') as FormArray).push(productForm);
    }
  
    removeProduct(index: number): void {
      (this.addForm.get('produits') as FormArray).removeAt(index);
    }
  
    addProductEdit(): void {
      const productForm = this.fb.group({
        nom: ['', Validators.required],
        quantite: [1, [Validators.required, Validators.min(1)]],
        prixUnitaire: [0, [Validators.required, Validators.min(0)]],
        prix_total: [{ value: 0, disabled: true }],
      });
      (this.editForm.get('produits') as FormArray).push(productForm);
    }
  
    removeProductEdit(index: number): void {
      (this.editForm.get('produits') as FormArray).removeAt(index);
    }
  
    onAddFacture(): void {
      if (this.addForm.valid) {
        const formData = { ...this.addForm.value };
        formData.nomFichier = `${formData.numFacture}.pdf`;
    
        this.factureService.createFactureAchat(formData, this.user.entreprise.id, this.addForm.value.idFournisseur, this.user.email).subscribe({
          next: () => {
            this.save();
            Swal.fire('Ajouté!', "La facture a été ajoutée.", 'success');
            this.getAllFacture(this.user.entreprise.id);
            this.add?.hide();
          },
          error: error => {
            console.error(error);
            Swal.fire('Erreur!', 'Une erreur est survenue lors de l\'ajout.', 'error');
          }
        });
      }
    }
  
    editModal(facture: any): void {
      this.selectedFacture = facture;
    
      this.editForm.patchValue({
        numFacture: facture.numFacture,
        tva: facture.tva,
        idFournisseur: facture.fournisseur ? facture.fournisseur.id : null
      });
    
      // Reset and populate products
      const produitsArray = this.editForm.get('produits') as FormArray;
      produitsArray.clear(); // Clear existing products in the form array
    
      facture.produits.forEach((prod: any) => {
        produitsArray.push(this.fb.group({
          nom: [prod.nom, Validators.required],
          quantite: [prod.quantite, [Validators.required, Validators.min(1)]],
          prixUnitaire: [prod.prixUnitaire, [Validators.required, Validators.min(0)]],
          prix_total: [{ value: prod.prix_total, disabled: true }],
        }));
      });
    
      this.edit?.show();
    }
  
    onUpdateFacture(): void {
      if (this.editForm.valid) {
        const formData = { ...this.editForm.value };
        formData.nomFichier = `${formData.numFacture}.pdf`;

  
        this.factureService.updateFactureAchat(this.selectedFacture.id, formData, this.user.email).subscribe({
          next: () => {
            this.saveEdit();
            Swal.fire('Modifié!', "La facture a été modifiée.", 'success');
            this.getAllFacture(this.user.entreprise.id);
            this.edit?.hide();
          },
          error: error => {
            console.error(error);
            Swal.fire('Erreur!', 'Une erreur est survenue lors de la modification.', 'error');
          }
        });
      }
    }
  
    deleteModule(factureId: number): void {
      Swal.fire({
        title: 'Êtes-vous sûr?',
        text: 'Cette action ne peut pas être annulée!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer!',
        cancelButtonText: 'Annuler'
      }).then(result => {
        if (result.isConfirmed) {
          this.factureService.deleteFactureAchat(factureId).subscribe({
            next: () => {
              Swal.fire('Supprimé!', "La facture a été supprimée.", 'success');
              this.getAllFacture(this.user.entreprise.id);
            },
            error: error => {
              console.error(error);
              Swal.fire('Erreur!', 'Une erreur est survenue lors de la suppression.', 'error');
            }
          });
        }
      });
    }
  
    searchEmployeBy(): void {
      if (this.searchArticle.trim() === '') {
        this.getAllFacture(this.user.entreprise.id);
      } else {
        this.factures = this.factures.filter(n =>
          n.numFacture.toLowerCase().includes(this.searchArticle.toLowerCase()) || n.fournisseur.nom.toLowerCase().includes(this.searchArticle.toLowerCase())
        );
      }
    }
  
  
    onDownloadFile(filename:string,numFacture:string){
      this.factureService.downloadFile(filename,this.user.email).subscribe(
        event=>{
          console.log(event);
          this.reportProgress(event,numFacture);
        },
        (error:HttpErrorResponse)=>{
          console.log(error);
        }
      );
    }
    private reportProgress(httpEvent: HttpEvent<string | Blob>,numFacture:string) {
      switch (httpEvent.type){
        case HttpEventType.Response:
          if (httpEvent.body instanceof Blob) {
            saveAs(httpEvent.body, numFacture);
          } else {
            console.error('Invalid response body. Expected Blob, but received:', typeof httpEvent.body);
          }
            // saveAs(new Blob([httpEvent.body!],
            //     {type:`${httpEvent.headers.get('Content-Type')};charset=utf-8`}),
            // httpEvent.headers.get('File-Name'));
          break;
        default:
          console.log(httpEvent);
      }
    }
  
    save(): void {
      // Récupérer les valeurs du formulaire
      const orderNumber = this.addForm.value.numFacture; // Use numCommande from the form
      const supplierId = this.addForm.value.idFournisseur; // Get the supplier ID
      const vat = this.addForm.value.tva; // VAT from the form
      const products = this.addForm.value.produits; // Product array from the form
    
      // Retrieve supplier details
      this.fournisseurService.getFournisseurById(supplierId).subscribe(supplier => {
        // Create the PDF
        const pdfContent = this.generatePdfContent(orderNumber, supplier, vat, products);
        const pdfDoc = pdfMake.createPdf(pdfContent);
        
        pdfDoc.getBlob((blob: File) => {
          this.attachementName = `${orderNumber}.pdf`;
    
          this.factureService.uploadFile(blob, this.attachementName).subscribe(
            (event: any) => {
              // Handle upload success or progress here
              console.log('File uploaded successfully', event);
            },
            (error) => {
              if (error.status === 400) {
                const errorMessage = error.error;
                console.log(errorMessage);
                alert(errorMessage);
              }
            }
          );
        });
      });
    }
    saveEdit(): void {
      // Récupérer les valeurs du formulaire
      const orderNumber = this.editForm.value.numFacture; // Use numCommande from the form
      const supplierId = this.editForm.value.idFournisseur; // Get the supplier ID
      const vat = this.editForm.value.tva; // VAT from the form
      const products = this.editForm.value.produits; // Product array from the form
    
      // Retrieve supplier details
      this.fournisseurService.getFournisseurById(supplierId).subscribe(supplier => {
        // Create the PDF
        const pdfContent = this.generatePdfContent(orderNumber, supplier, vat, products);
        const pdfDoc = pdfMake.createPdf(pdfContent);
        
        pdfDoc.getBlob((blob: File) => {
          this.attachementName = `${orderNumber}.pdf`;
    
          this.factureService.uploadFile(blob, this.attachementName).subscribe(
            (event: any) => {
              // Handle upload success or progress here
              console.log('File uploaded successfully', event);
            },
            (error) => {
              if (error.status === 400) {
                const errorMessage = error.error;
                console.log(errorMessage);
                alert(errorMessage);
              }
            }
          );
        });
      });
    }
    generatePdfContent(orderNumber: string, supplier: any, vat: number, products: any[]) {
      const prixHorsTaxe = products.reduce((acc, product) => acc + product.quantite * product.prixUnitaire, 0);
      const taxe = (prixHorsTaxe * vat) / 100;
      const prixPayer = prixHorsTaxe + taxe;
  
      return {
        content: [
          {
            text: 'Facture d\'Achat',
            fontSize: 28,
            bold: true,
            alignment: 'center',
            decoration: 'underline',
            color: 'skyblue',
            margin: [0, 20, 0, 20]
          },
          {
            text: 'Informations de la facture',
            style: 'sectionHeader',
            margin: [0, 10, 0, 10]
          },
          {
            columns: [
              [
                { text: `Numéro de la Facture : ${orderNumber}`, bold: true },
                { text: `Fournisseur : ${supplier.nom}`, bold: true },
                { text: `Email : ${supplier.email}` },
                { text: `Téléphone : ${supplier.tel}` },
                { text: `Adresse : ${supplier.adresse}` }
              ],
              [
                {
                  text: `Date : ${new Date().toLocaleString()}`,
                  alignment: 'right',
                  italics: true
                }
              ]
            ],
            columnGap: 20
          },
          {
            text: 'Détails de l\'Entreprise Acheteuse',
            style: 'sectionHeader',
            margin: [0, 20, 0, 10]
          },
          {
            columns: [
              [
                { text: `Nom de l'Entreprise : ${this.user.entreprise.name}`, bold: true },
                { text: `Email : ${this.user.entreprise.email}` },
                { text: `Téléphone : ${this.user.entreprise.tel}` },
                { text: `Adresse : ${this.user.entreprise.address}` }
              ]
            ],
            columnGap: 20
          },
          {
            text: 'Détails des Produits',
            style: 'sectionHeader',
            margin: [0, 20, 0, 10]
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto'],
              body: [
                [
                  { text: 'Nom de produit', style: 'tableHeader' },
                  { text: 'Quantité', style: 'tableHeader' },
                  { text: 'Prix (Dt)', style: 'tableHeader' }
                ],
                ...products.map(product => [
                  product.nom,
                  product.quantite,
                  product.prixUnitaire.toFixed(2)
                ]),
                ['', '', { text: `Prix hors taxe : ${prixHorsTaxe.toFixed(2)} Dt`, style: 'tableTotal' }],
                ['', '', { text: `TVA : ${vat}%`, style: 'tableTotal' }],
                [{ text: 'Total à payer', colSpan: 2 }, {}, { text: `${prixPayer.toFixed(2)} Dt`, style: 'tableTotalValue' }]
              ]
            },
            layout: {
              hLineWidth: (i: number) => (i === 0 ? 1 : 0.5), // Header line
              vLineWidth: () => 0.5,
              hLineColor: () => '#000',
              fillColor: (rowIndex: number) => (rowIndex % 2 === 0 ? '#f5f5f5' : null), // Alternate row coloring
              paddingLeft: (i: number) => 10,
              paddingRight: (i: number) => 10,
              paddingTop: () => 5,
              paddingBottom: () => 5
            }
          },
          {
            text: 'Remarques',
            style: 'sectionHeader',
            margin: [0, 20, 0, 10]
          },
          {
            text: 'Merci pour votre confiance ! Si vous avez des questions, n’hésitez pas à nous contacter.',
            italics: true,
            margin: [0, 0, 0, 20],
            alignment: 'center'
          }
        ],
        styles: {
          sectionHeader: {
            bold: true,
            fontSize: 16,
            margin: [0, 15, 0, 15]
          },
          tableHeader: {
            bold: true,
            fontSize: 12,
            color: '#ffffff',
            fillColor: '#00305d',
            margin: [0, 5, 0, 5]
          },
          tableTotal: {
            fontSize: 10,
            bold: true,
            alignment: 'right',
            margin: [0, 10, 0, 10],
          },
          tableTotalValue: {
            fontSize: 10,
            bold: true,
            alignment: 'right',
            margin: [0, 10, 0, 10],
            color: '#00305d',
          }
        }
      };
  }
  
  getCRMPermissions(user:any) {
    const crmModule = user.modules.find(module => module.module.nom === 'CRM');
    if (crmModule) {
      return {
        consulter: crmModule.consulter,
        modifier: crmModule.modifier,
        ajouter: crmModule.ajouter,
        supprimer: crmModule.supprimer
      };
    }
    return null; // or return default permissions if needed
  }
  
  convertToReception(facture: any): void {
    // Logic to convert the commande to a Facture Achat
    console.log('Converting to Facture Achat for commande:', facture);
    
    // You may want to navigate to a different page or show a confirmation dialog
    // Example: Navigating to a new route or opening a modal
    this.receptionService.convertirFactureEnReception(facture.id,this.user.email).subscribe({
        next: (response) => {
            this.savereception(response);
            Swal.fire('Succès!', 'Facture convertie en réception.', 'success');
            this.getAllFacture(this.user.entreprise.id); // Refresh the list if needed
        },
        error: (error) => {
            console.error('Error converting to Facture Achat', error);
            Swal.fire('Erreur!', 'Une erreur est survenue lors de la conversion.', 'error');
        }
    });
  }
  
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  savereception(reception:any): void {
    // Récupérer les valeurs du formulaire
    const factureNumber = reception.numReception; // Use numCommande from the form
    const supplierId = reception.fournisseur.id; // Get the supplier ID
    const vat = reception.tva; // VAT from the form
    const products = reception.produits; // Product array from the form
  
    // Retrieve supplier details
    this.fournisseurService.getFournisseurById(supplierId).subscribe(supplier => {
      // Create the PDF
      const pdfContent = this.generatePdfContentreception(factureNumber, supplier, vat, products);
      const pdfDoc = pdfMake.createPdf(pdfContent);
      
      pdfDoc.getBlob((blob: File) => {
        this.attachementName = `${factureNumber}.pdf`;
  
        this.receptionService.uploadFile(blob, this.attachementName).subscribe(
          (event: any) => {
            // Handle upload success or progress here
            console.log('File uploaded successfully', event);
          },
          (error) => {
            if (error.status === 400) {
              const errorMessage = error.error;
              console.log(errorMessage);
              alert(errorMessage);
            }
          }
        );
      });
    });
  }
  generatePdfContentreception(orderNumber: string, supplier: any, vat: number, products: any[]) {
    const prixHorsTaxe = products.reduce((acc, product) => acc + product.quantite * product.prixUnitaire, 0);
    const taxe = (prixHorsTaxe * vat) / 100;
    const prixPayer = prixHorsTaxe + taxe;
  
    return {
      content: [
        {
          text: 'Réception d\'Achat',
          fontSize: 28,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue',
          margin: [0, 20, 0, 20]
        },
        {
          text: 'Informations de la Réception',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        {
          columns: [
            [
              { text: `Numéro de la réception : ${orderNumber}`, bold: true },
              { text: `Fournisseur : ${supplier.nom}`, bold: true },
              { text: `Email : ${supplier.email}` },
              { text: `Téléphone : ${supplier.tel}` },
              { text: `Adresse : ${supplier.adresse}` }
            ],
            [
              {
                text: `Date : ${new Date().toLocaleString()}`,
                alignment: 'right',
                italics: true
              }
            ]
          ],
          columnGap: 20
        },
        {
          text: 'Détails de l\'Entreprise Acheteuse',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        {
          columns: [
            [
              { text: `Nom de l'Entreprise : ${this.user.entreprise.name}`, bold: true },
              { text: `Email : ${this.user.entreprise.email}` },
              { text: `Téléphone : ${this.user.entreprise.tel}` },
              { text: `Adresse : ${this.user.entreprise.address}` }
            ]
          ],
          columnGap: 20
        },
        {
          text: 'Détails des Produits',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto'],
            body: [
              [
                { text: 'Nom de produit', style: 'tableHeader' },
                { text: 'Quantité', style: 'tableHeader' },
                { text: 'Prix (Dt)', style: 'tableHeader' }
              ],
              ...products.map(product => [
                product.nom,
                product.quantite,
                product.prixUnitaire.toFixed(2)
              ]),
              ['', '', { text: `Prix hors taxe : ${prixHorsTaxe.toFixed(2)} Dt`, style: 'tableTotal' }],
              ['', '', { text: `TVA : ${vat}%`, style: 'tableTotal' }],
              [{ text: 'Total à payer', colSpan: 2 }, {}, { text: `${prixPayer.toFixed(2)} Dt`, style: 'tableTotalValue' }]
            ]
          },
          layout: {
            hLineWidth: (i: number) => (i === 0 ? 1 : 0.5),
            vLineWidth: () => 0.5,
            hLineColor: () => '#000',
            fillColor: (rowIndex: number) => (rowIndex % 2 === 0 ? '#f5f5f5' : null),
            paddingLeft: () => 10,
            paddingRight: () => 10,
            paddingTop: () => 5,
            paddingBottom: () => 5
          }
        },
        {
          text: 'Remarques',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        {
          text: 'Merci pour votre confiance ! Si vous avez des questions, n’hésitez pas à nous contacter.',
          italics: true,
          margin: [0, 0, 0, 20],
          alignment: 'center'
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          fontSize: 16,
          margin: [0, 15, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: '#ffffff',
          fillColor: '#00305d',
          margin: [0, 5, 0, 5]
        },
        tableTotal: {
          fontSize: 10,
          bold: true,
          alignment: 'right',
          margin: [0, 10, 0, 10],
        },
        tableTotalValue: {
          fontSize: 10,
          bold: true,
          alignment: 'right',
          margin: [0, 10, 0, 10],
          color: '#00305d',
        }
      }
    };
  }

  verif(id: number): void {
          Swal.fire({
            title: 'Vous êtes sûr(e) ?',
            text: "Vous ne pourrez pas revenir en arrière !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui!',
          }).then((result) => {
            if (result.isConfirmed) {
              this.factureService.updateFacturePaye(id).subscribe({
                next: (data: any) => {
                  if (data.paye) {
                    Swal.fire({
                      title: 'Payé!',
                      text: "Cette facture est payée.",
                      icon: 'success',
                    });
                  } else {
                    Swal.fire({
                      title: 'En attente!',
                      text: "Cette facture est en attente.",
                      icon: 'success',
                    });
                  }
                  location.reload();
                },
                error: (err) => {
                  console.log(err);
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Une erreur est survenue!',
                  });
                }
              });
            }
          });
        }

}
