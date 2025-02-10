import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { ArticleService } from 'src/app/core/services/article.service';
import { ClientService } from 'src/app/core/services/client.service';
import { CommandeService } from 'src/app/core/services/commande.service';
import { DevisService } from 'src/app/core/services/devis.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { FactureService } from 'src/app/core/services/facture.service';
import { LivraisonService } from 'src/app/core/services/livraison.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import  pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.scss']
})
export class CommandeComponent {

  addForm: FormGroup;
    commandes:any[]=[];
    clients: any[] = [];
    articles: any[] = [];
    selectedClient: any;
    editForm: FormGroup;
    selectedCommande: any;
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
      private fb: FormBuilder,
      private clientService: ClientService,
      private articleService: ArticleService,
      private entrepriseService: EntrepriseService,
              private employeService: EmployeService,
              private adminService: AdminSessionService,
      private commandeService: CommandeService,
      private livraisonService:LivraisonService,
      private factureService:FactureService
    ) {
      this.addForm = this.fb.group({
        numCommande: ['', Validators.required],
        priceHt: [{ value: 0, disabled: true }],
        tva: [0, Validators.required],
        taxe: [{ value: 0, disabled: true }],
        netApayer: [{ value: 0, disabled: true }],
        clientId: [null, Validators.required],
        produits: this.fb.array([]),
      });
  
      this.editForm = this.fb.group({
        numCommande: ['', Validators.required],
        priceHt: [{ value: 0, disabled: true }],
        tva: [0, Validators.required],
        taxe: [{ value: 0, disabled: true }],
        netApayer: [{ value: 0, disabled: true }],
        clientId: [null, Validators.required],
        produits: this.fb.array([]),
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
          this.getClients(data.entreprise.id);
      this.getArticles(data.entreprise.id);
      this.getAllCommandes(data.entreprise.id);
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
  
    getClients(idEnt: number): void {
      this.clientService.getClientsByEntrepriseId(idEnt).subscribe(clients => { // Replace 1 with actual entrepriseId
        this.clients = clients;
      });
    }
  
    getArticles(idEnt: number): void {
      this.articleService.getArticlesByEntrepriseId(idEnt).subscribe(articles => { // Replace 1 with actual entrepriseId
        this.articles = articles;
      });
    }
  
    getAllCommandes(idEnt: number): void {
      this.commandeService.getCommandesByEntrepriseId(idEnt).subscribe(commandes => {
        this.commandes = commandes;
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
            prixUnitaire: [0, [Validators.required, Validators.min(0)]],
            prix_total: [{ value: 0, disabled: true }],
            nom: ['', Validators.required],
        quantite: [1, [Validators.required, Validators.min(1)]],
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
  
    onAddCommande(): void {
      if (this.addForm.valid) {
        const products = this.addForm.value.produits;
        const hasInvalidQuantity = products.some(product => {
          const article = this.articles.find(a => a.nom === product.nom);
          return product.quantite > article.quantite;
        });
  
        if (hasInvalidQuantity) {
          Swal.fire('Erreur!', 'La quantité demandée dépasse le stock disponible.', 'error');
          return;
        }
  
        const formData = { ...this.addForm.value };
            formData.nomFichier = `${formData.numCommande}.pdf`;
  
        this.commandeService.createCommande(formData,this.user.entreprise.id, this.addForm.value.clientId,this.user.email) // Replace with actual data
          .subscribe({
            next: () => {
              this.save();
              Swal.fire('Ajouté!', 'La commande a été ajouté avec succès.', 'success');
              this.getAllCommandes(this.user.entreprise.id);
              this.add?.hide();
              this.addForm.reset();
            },
            error: error => {
              console.error(error);
              Swal.fire('Erreur!', 'Une erreur est survenue lors de l\'ajout du commande.', 'error');
            }
          });
      }
    }
  
    editModal(commande: any): void {
            this.selectedCommande = commande;
          
            this.editForm.patchValue({
              numCommande: commande.numCommande,
              tva: commande.tva,
              clientId: commande.client ? commande.client.id : null
            });
          
            // Reset and populate products
            const produitsArray = this.editForm.get('produits') as FormArray;
            produitsArray.clear(); // Clear existing products in the form array
          
            commande.produits.forEach((prod: any) => {
              produitsArray.push(this.fb.group({
                nom: [prod.nom, Validators.required],
                quantite: [prod.quantite, [Validators.required, Validators.min(1)]],
                prixUnitaire: [prod.prixUnitaire, [Validators.required, Validators.min(0)]],
                prix_total: [{ value: prod.prix_total, disabled: true }],
              }));
            });
          
            this.edit?.show();
          }
        
          onUpdateCommande(): void {
            if (this.editForm.valid) {
              const products = this.editForm.value.produits;
        const hasInvalidQuantity = products.some(product => {
          const article = this.articles.find(a => a.nom === product.nom);
          return product.quantite > article.quantite;
        });
  
        if (hasInvalidQuantity) {
          Swal.fire('Erreur!', 'La quantité demandée dépasse le stock disponible.', 'error');
          return;
        }
              const formData = { ...this.editForm.value };
              formData.nomFichier = `${formData.numCommande}.pdf`;
      
        
              this.commandeService.updateCommande(this.selectedCommande.id, formData, this.user.email).subscribe({
                next: () => {
                  this.saveEdit();
                  Swal.fire('Modifié!', "La commande a été modifiée.", 'success');
                  this.getAllCommandes(this.user.entreprise.id);
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
                this.commandeService.deleteCommande(factureId).subscribe({
                  next: () => {
                    Swal.fire('Supprimé!', "La commande a été supprimée.", 'success');
                    this.getAllCommandes(this.user.entreprise.id);
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
              this.getAllCommandes(this.user.entreprise.id);
            } else {
              this.commandes = this.commandes.filter(n =>
                n.numCommande.toLowerCase().includes(this.searchArticle.toLowerCase()) || n.client.nom.toLowerCase().includes(this.searchArticle.toLowerCase())
              );
            }
          }
        
        
          onDownloadFile(filename:string,numFacture:string){
            this.commandeService.downloadFile(filename,this.user.email).subscribe(
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
            const orderNumber = this.addForm.value.numCommande; // Use numCommande from the form
            const supplierId = this.addForm.value.clientId; // Get the supplier ID
            const vat = this.addForm.value.tva; // VAT from the form
            const products = this.addForm.value.produits; // Product array from the form
          
            // Retrieve supplier details
            this.clientService.getClientById(supplierId).subscribe(supplier => {
              // Create the PDF
              const pdfContent = this.generatePdfContent(orderNumber, supplier, vat, products);
              const pdfDoc = pdfMake.createPdf(pdfContent);
              
              pdfDoc.getBlob((blob: File) => {
                this.attachementName = `${orderNumber}.pdf`;
          
                this.commandeService.uploadFile(blob, this.attachementName).subscribe(
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
            const orderNumber = this.editForm.value.numCommande; // Use numCommande from the form
            const supplierId = this.editForm.value.clientId; // Get the supplier ID
            const vat = this.editForm.value.tva; // VAT from the form
            const products = this.editForm.value.produits; // Product array from the form
          
            // Retrieve supplier details
            this.clientService.getClientById(supplierId).subscribe(supplier => {
              // Create the PDF
              const pdfContent = this.generatePdfContent(orderNumber, supplier, vat, products);
              const pdfDoc = pdfMake.createPdf(pdfContent);
              
              pdfDoc.getBlob((blob: File) => {
                this.attachementName = `${orderNumber}.pdf`;
          
                this.commandeService.uploadFile(blob, this.attachementName).subscribe(
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
                  text: 'Commande',
                  fontSize: 28,
                  bold: true,
                  alignment: 'center',
                  decoration: 'underline',
                  color: 'skyblue',
                  margin: [0, 20, 0, 20]
                },
                {
                  text: 'Informations de commande',
                  style: 'sectionHeader',
                  margin: [0, 10, 0, 10]
                },
                {
                  columns: [
                    [
                      { text: `Numéro de commande : ${orderNumber}`, bold: true },
                      { text: `client : ${supplier.nom}`, bold: true },
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
                  text: 'Détails de l\'Entreprise',
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
  
  
        convertToLivraison(facture: any): void {
            // Logic to convert the commande to a Facture Achat
            console.log('Converting to Facture Achat for commande:', facture);
            
            // You may want to navigate to a different page or show a confirmation dialog
            // Example: Navigating to a new route or opening a modal
            this.livraisonService.convertirCommandeEnLivraison(facture.id,this.user.email).subscribe({
                next: (response) => {
                    this.savelivraison(response);
                    Swal.fire('Succès!', 'Commande convertie en livraison.', 'success');
                    this.getAllCommandes(this.user.entreprise.id); // Refresh the list if needed
                },
                error: (error) => {
                    console.error('Error converting to Facture Achat', error);
                    Swal.fire('Erreur!', 'Une erreur est survenue lors de la conversion.', 'error');
                }
            });
          }

          convertToFacture(facture: any): void {
            // Logic to convert the commande to a Facture Achat
            console.log('Converting to Facture Achat for commande:', facture);
            
            // You may want to navigate to a different page or show a confirmation dialog
            // Example: Navigating to a new route or opening a modal
            this.factureService.convertirCommandeEnFacture(facture.id,this.user.email).subscribe({
                next: (response) => {
                    this.savefacture(response);
                    Swal.fire('Succès!', 'Commande convertie en facture.', 'success');
                    this.getAllCommandes(this.user.entreprise.id); // Refresh the list if needed
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
          
          savelivraison(reception:any): void {
            // Récupérer les valeurs du formulaire
            const factureNumber = reception.numLivraison; // Use numCommande from the form
            const supplierId = reception.client.id; // Get the supplier ID
            const vat = reception.tva; // VAT from the form
            const products = reception.produits; // Product array from the form
          
            // Retrieve supplier details
            this.clientService.getClientById(supplierId).subscribe(supplier => {
              // Create the PDF
              const pdfContent = this.generatePdfContentlivraison(factureNumber, supplier, vat, products);
              const pdfDoc = pdfMake.createPdf(pdfContent);
              
              pdfDoc.getBlob((blob: File) => {
                this.attachementName = `${factureNumber}.pdf`;
          
                this.livraisonService.uploadFile(blob, this.attachementName).subscribe(
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

          savefacture(reception:any): void {
            // Récupérer les valeurs du formulaire
            const factureNumber = reception.numFacture; // Use numCommande from the form
            const supplierId = reception.client.id; // Get the supplier ID
            const vat = reception.tva; // VAT from the form
            const products = reception.produits; // Product array from the form
          
            // Retrieve supplier details
            this.clientService.getClientById(supplierId).subscribe(supplier => {
              // Create the PDF
              const pdfContent = this.generatePdfContentfacture(factureNumber, supplier, vat, products);
              const pdfDoc = pdfMake.createPdf(pdfContent);
              
              pdfDoc.getBlob((blob: File) => {
                this.attachementName = `${factureNumber}.pdf`;
          
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
          generatePdfContentlivraison(orderNumber: string, supplier: any, vat: number, products: any[]) {
            const prixHorsTaxe = products.reduce((acc, product) => acc + product.quantite * product.prixUnitaire, 0);
            const taxe = (prixHorsTaxe * vat) / 100;
            const prixPayer = prixHorsTaxe + taxe;
          
            return {
              content: [
                {
                  text: 'Livraison',
                  fontSize: 28,
                  bold: true,
                  alignment: 'center',
                  decoration: 'underline',
                  color: 'skyblue',
                  margin: [0, 20, 0, 20]
                },
                {
                  text: 'Informations de la livraison',
                  style: 'sectionHeader',
                  margin: [0, 10, 0, 10]
                },
                {
                  columns: [
                    [
                      { text: `Numéro de la livraison : ${orderNumber}`, bold: true },
                      { text: `Client : ${supplier.nom}`, bold: true },
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

          generatePdfContentfacture(orderNumber: string, supplier: any, vat: number, products: any[]) {
            const prixHorsTaxe = products.reduce((acc, product) => acc + product.quantite * product.prixUnitaire, 0);
            const taxe = (prixHorsTaxe * vat) / 100;
            const prixPayer = prixHorsTaxe + taxe;
          
            return {
              content: [
                {
                  text: 'Facture',
                  fontSize: 28,
                  bold: true,
                  alignment: 'center',
                  decoration: 'underline',
                  color: 'skyblue',
                  margin: [0, 20, 0, 20]
                },
                {
                  text: 'Informations de la Commande',
                  style: 'sectionHeader',
                  margin: [0, 10, 0, 10]
                },
                {
                  columns: [
                    [
                      { text: `Numéro de la facture : ${orderNumber}`, bold: true },
                      { text: `Client : ${supplier.nom}`, bold: true },
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

}
