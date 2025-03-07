import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeEntrepriseComponent } from './employe/list-employe-entreprise/list-employe-entreprise.component';
import { ProfileComponent } from './profile/profile.component';
import { ListNotificationComponent } from './list-notification/list-notification.component';
import { ListModuleEmployeByEmployeComponent } from './list-module-employe-by-employe/list-module-employe-by-employe.component';
import { ListModuleEmployeEntrepriseComponent } from './list-module-employe-entreprise/list-module-employe-entreprise.component';
import { ListEntrepriseComponent } from './list-entreprise/list-entreprise.component';
import { ListEmployeAdminComponent } from './employe/list-employe-admin/list-employe-admin.component';
import { ListModuleComponent } from './list-module/list-module.component';
import { ListSessionEmployeComponent } from './list-session-employe/list-session-employe.component';
import { ClientComponent } from './client/client.component';
import { ClientMapComponent } from './client-map/client-map.component';
import { FournisseurComponent } from './fournisseur/fournisseur.component';
import { FournisseurMapComponent } from './fournisseur-map/fournisseur-map.component';
import { MouvementComponent } from './mouvement/mouvement.component';
import { ArticleComponent } from './article/article.component';
import { AchatComponent } from './achat/achat.component';
import { VenteComponent } from './vente/vente.component';
import { CommandeAchatComponent } from './commande-achat/commande-achat.component';
import { ComachatfileComponent } from './comachatfile/comachatfile.component';
import { FactureAchatComponent } from './facture-achat/facture-achat.component';
import { FacachatfileComponent } from './facachatfile/facachatfile.component';
import { ReceptionAchatComponent } from './reception-achat/reception-achat.component';
import { RecepachatfileComponent } from './recepachatfile/recepachatfile.component';
import { DevisComponent } from './devis/devis.component';
import { DevisfileComponent } from './devisfile/devisfile.component';
import { CommandeComponent } from './commande/commande.component';
import { CommandefileComponent } from './commandefile/commandefile.component';
import { LivraisonComponent } from './livraison/livraison.component';
import { LivraisonfileComponent } from './livraisonfile/livraisonfile.component';
import { FactureComponent } from './facture/facture.component';
import { FacturefileComponent } from './facturefile/facturefile.component';
import { SortieComponent } from './sortie/sortie.component';
import { SortiefileComponent } from './sortiefile/sortiefile.component';




const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: ListEmployeEntrepriseComponent
  },
  { path: 'employes', component: ListEmployeEntrepriseComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'notifications', component: ListNotificationComponent },
  { path: 'modules/:idemp', component: ListModuleEmployeByEmployeComponent },
  { path: 'modules', component: ListModuleEmployeEntrepriseComponent },
  { path: 'entreprises', component: ListEntrepriseComponent },
  { path: 'employes/:ident', component: ListEmployeAdminComponent },
  { path: 'modulesadmin', component: ListModuleComponent },
  { path: 'sessionemploye', component: ListSessionEmployeComponent },
  { path: 'clients', component: ClientComponent },
  { path: 'clients/map/:id', component: ClientMapComponent },
  { path: 'fournisseurs', component: FournisseurComponent },
  { path: 'fournisseurs/map/:id', component: FournisseurMapComponent },
  { path: 'mouvements', component: MouvementComponent },
  { path: 'articles', component: ArticleComponent },
  { path: 'achat', component: AchatComponent },
  { path: 'vente', component: VenteComponent },
  { path: 'commandeachat', component: CommandeAchatComponent },
  { path: 'commandeachat/:filename/:ido', component: ComachatfileComponent },
  { path: 'factureachat', component: FactureAchatComponent },
  { path: 'factureachat/:filename/:ido', component: FacachatfileComponent },
  { path: 'receptionachat', component: ReceptionAchatComponent },
  { path: 'receptionachat/:filename/:ido', component: RecepachatfileComponent },
  { path: 'devis', component: DevisComponent },
  { path: 'devis/:filename/:ido', component: DevisfileComponent },
  { path: 'commande', component: CommandeComponent },
  { path: 'commande/:filename/:ido', component: CommandefileComponent },
  { path: 'livraison', component: LivraisonComponent },
  { path: 'livraison/:filename/:ido', component: LivraisonfileComponent },
  { path: 'facture', component: FactureComponent },
  { path: 'facture/:filename/:ido', component: FacturefileComponent },
  { path: 'sortie', component: SortieComponent },
  { path: 'sortie/:filename/:ido', component: SortiefileComponent },

  





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
