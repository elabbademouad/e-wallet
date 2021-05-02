export default class BaseRepository {
  constructor(db, modelName) {
    this.db = db;
    this.modelName = modelName;
  }

  getAll() {
    const result = new Promise((resolve, reject) => {
      const request = this.db
        .transaction(this.modelName, "readonly")
        .objectStore(this.modelName)
        .openCursor();
      const data = [];
      request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          data.push(cursor.value);
          cursor.continue();
        } else {
          resolve(data);
        }
      };
      request.onerror = (e) => {
        const { code, message, name } = e.target.error;
        reject({ code, message, name });
      };
    });

    return result;
  }

  query(query) {
    const result = new Promise((resolve, reject) => {
      const request = this.db
        .transaction(this.modelName, "readonly")
        .objectStore(this.modelName)
        .openCursor();
      const data = [];
      request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor && query(cursor.value)) {
          data.push(cursor.value);
          cursor.continue();
        } else if (cursor) {
          cursor.continue();
        } else {
          resolve(data);
        }
      };
      request.onerror = (e) => {
        const { code, message, name } = e.target.error;
        reject({ code, message, name });
      };
    });

    return result;
  }

  getById(id) {
    const result = new Promise((resolve, reject) => {
      const request = this.db
        .transaction(this.modelName, "readonly")
        .objectStore(this.modelName)
        .get(id);
      request.onsuccess = (e) => {
        resolve(e.target.result);
      };
      request.onerror = (e) => {
        const { code, message, name } = e.target.error;
        reject({ code, message, name });
      };
    });

    return result;
  }

  updateOrCreate(model) {
    const result = new Promise((resolve, reject) => {
      if (model.id) {
        const request = this.db
          .transaction(this.modelName, "readwrite")
          .objectStore(this.modelName)
          .put(model);
        request.onsuccess = (e) => {
          resolve(e.target.result);
        };
        request.onerror = (e) => {
          const { code, message, name } = e.target.error;
          reject({ code, message, name });
        };
      } else {
        reject({
          code: "C0",
          message: "The id of the model is undefind",
          name: "Empty constraint",
        });
      }
    });

    return result;
  }

  delete(id) {
    const result = new Promise((resolve, reject) => {
      const request = this.db
        .transaction(this.modelName, "readwrite")
        .objectStore(this.modelName)
        .delete(id);
      request.onsuccess = (e) => {
        resolve(true);
      };
      request.onerror = (e) => {
        const { code, message, name } = e.target.error;
        reject({ code, message, name });
      };
    });

    return result;
  }
}
