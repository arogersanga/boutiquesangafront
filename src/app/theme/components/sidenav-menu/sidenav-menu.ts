import {SidenavMenu} from './sidenav-menu.model';

export const sidenavMenuItems = [
  new SidenavMenu(1, 'NAV.HOME', '/', null, null, false, 0),
  new SidenavMenu(2, 'Produits Par Catégories', null, null, null, true, 0),
  new SidenavMenu(11, 'Boucles d\'Oreilles', '/products/bouclesoreilles', null, null, true, 2),
  new SidenavMenu(12, 'Bracelets', '/products/bracelets', null, null, true, 2),
  new SidenavMenu(14, 'Portes clés', '/products/portescles', null, null, true, 2),
  new SidenavMenu(20, 'Gros Bracelets', '/products/grosbracelets', null, null, false, 12),
  new SidenavMenu(21, 'Petits Bracelets', '/products/bracelets', null, null, false, 12),
  new SidenavMenu(22, 'Portes clés Personnalisés', '/products/portesclespersonnalises', null, null, false, 14),
  new SidenavMenu(23, 'Autres Portes clés', '/products/porteclesnonpersonnalises', null, null, false, 14),
  new SidenavMenu(24, 'Afrique Map', '/products/afriquemap', null, null, false, 11),
  new SidenavMenu(25, 'Forme Coeur', '/products/formecoeur', null, null, false, 11),
  new SidenavMenu(26, 'Forme Feuille', '/products/formefeuille', null, null, false, 11),
  new SidenavMenu(27, 'Forme Losange', '/products/formelosange', null, null, false, 11),
  new SidenavMenu(28, 'Forme Pomme', '/products/formepomme', null, null, false, 11),
  new SidenavMenu(4, 'Tous les Produits', '/products', null, null, false, 0),
  //new SidenavMenu(64, 'NAV.CART', '/cart', null, null, false, 0),
  //new SidenavMenu(65, 'NAV.CHECKOUT', '/checkout', null, null, false, 64),
  //new SidenavMenu(72, 'NAV.LANDING', '/landing', null, null, false, 0),
  new SidenavMenu(80, 'NAV.CONTACT', '/contact', null, null, false, 0),
  new SidenavMenu(42, 'Se connecter / S\'enregistrer', '/connexion', null, null, false, 0)
];
