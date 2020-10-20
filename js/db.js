

let dbPromised = idb.openDB("top-euro-football", 1, {
    upgrade(db){

        let favoritesObjectStore = db.createObjectStore("favorite-clubs", {
            keyPath: "id"
        });
    
        favoritesObjectStore.createIndex("name", "name", { unique: false })
    }
    
});

const saveToFavoriteClubs = (data) => {
    dbPromised.then(db => {
        let tx = db.transaction("favorite-clubs", "readwrite");
        let store = tx.objectStore("favorite-clubs");
        store.add(data);
    })
}

const removeFromFavoriteClubs = (data) => {
    dbPromised.then(db => {
        let tx = db.transaction("favorite-clubs", "readwrite");
        let store = tx.objectStore("favorite-clubs");
        store.delete(data);
    })
}

const getAllSavedFavoriteClubs = () => {
    return new Promise((resolve, reject) => {
        dbPromised
        .then(db => {
            let tx = db.transaction("favorite-clubs", "readonly");
            let store = tx.objectStore("favorite-clubs");
            return store.getAll();
        })
        .then(data => {
            resolve(data);
        })
    })
}

const checkFavoriteClub = id => {
    return new Promise((resolve, reject) => {
        dbPromised
            .then(db => {
                let tx = db.transaction("favorite-clubs", "readonly");
                let store = tx.objectStore("favorite-clubs");
            
                return store.get(id);
            })
            .then(data => {
                resolve(data)
            })
    })
}

const getClubById = id => {
    return new Promise(function(resolve, reject) {
      dbPromised
        .then(function(db) {
          var tx = db.transaction("articles", "readonly");
          var store = tx.objectStore("articles");
          return store.get(id);
        })
        .then(function(article) {
          resolve(article);
        })
    });
  }


