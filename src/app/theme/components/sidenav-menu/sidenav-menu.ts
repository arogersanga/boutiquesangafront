import {SidenavMenu} from './sidenav-menu.model';

export const sidenavMenuItems = [
  new SidenavMenu(1, 'NAV.HOME', '/', null, null, false, 0),
  new SidenavMenu(2, 'Produits Par Catégories', null, null, null, true, 0),
  new SidenavMenu(11, 'Boucles d\'Oreilles', '/products/bouclesoreilles', null, null, false, 2),
  new SidenavMenu(12, 'Petits Bracelets', '/products/petitsbracelets', null, null, false, 2),
  new SidenavMenu(13, 'Gros Bracelets', '/products/grosbracelets', null, null, false, 2),
  new SidenavMenu(14, 'Portes clés', '/products/portescles', null, null, false, 2),
  new SidenavMenu(5, 'Femmes', null, null, null, true, 0),
  new SidenavMenu(21, 'T-shirts', '/products/t-shirtsFemmes', null, null, false, 5),
  new SidenavMenu(22, 'Chemises', '/products/chemisesHommes', null, null, false, 5),
  new SidenavMenu(23, 'Jupes', '/products/jupes', null, null, false, 5),
  new SidenavMenu(24, 'Robes', '/products/robes', null, null, false, 5),
  new SidenavMenu(3, 'Sacs', '/products/', null, null, true, 0),
  new SidenavMenu(31, 'Sacs à main', '/products/sacsAMain', null, null, false, 3),
  new SidenavMenu(32, 'Sacs à dos', '/products/sacados', null, null, false, 3),
  new SidenavMenu(33, 'Sacs pour ordinateurs', '/products/sacsPourOrdinateurs', null, null, false, 3),
  new SidenavMenu(4, 'Chaussures', '/products/chaussures', null, null, true, 0),
  new SidenavMenu(35, 'Sandales', '/products/sandales', null, null, false, 4),
  new SidenavMenu(40, 'Maucassins', '/products/maucassins', null, null, false, 4),
  new SidenavMenu(64, 'NAV.CART', '/cart', null, null, true, 0),
  new SidenavMenu(65, 'NAV.CHECKOUT', '/checkout', null, null, false, 64),
  new SidenavMenu(71, 'NAV.404_PAGE', '/404', null, null, false, 100),
  new SidenavMenu(72, 'NAV.LANDING', '/landing', null, null, false, 0),
  new SidenavMenu(80, 'NAV.CONTACT', '/contact', null, null, false, 0),
  new SidenavMenu(90, 'NAV.ADMIN', '/admin', null, null, false, 0),
  new SidenavMenu(42, 'Se connecter / S\'enregistrer', '/connexion', null, null, false, 0)
];
