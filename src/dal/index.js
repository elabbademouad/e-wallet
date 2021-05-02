import CategorieRepository from "./repositories/categorie-repository";
export default class DbContext {
  constructor() {
    const openRequest = indexedDB.open("e-wallet-db");
    openRequest.onupgradeneeded = (e) => {
      this.createDataStores(e.target.result);
    };

    openRequest.onsuccess = (e) => {
      this.categorieRepository = new CategorieRepository(
        e.target.result,
        "categorie"
      );
    };
  }
}
