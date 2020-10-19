

let dbPromised = idb.openDB("top-euro-football", 1, {
    upgrade(db){

        let clubsObjectStore = db.createObjectStore("clubs", {
            keyPath: "id"
        });
    
        clubsObjectStore.createIndex("name", "name", { unique: true })

        let favoritesObjectStore = db.createObjectStore("favorite-clubs", {
            keyPath: "id"
        });
    
        favoritesObjectStore.createIndex("name", "name", { unique: true })

        let standingsObjectStore = db.createObjectStore("standings", {
            keyPath: "id"
        });
    
        standingsObjectStore.createIndex("id", "id", { unique: true })

        let schedulesObjectStore = db.createObjectStore("schedules", {
            keyPath: "id"
        });
    
        schedulesObjectStore.createIndex("id", "id", { unique: true })
    }
    
});

const saveClubs = (data) => {
    dbPromised.then(db => {
        let tx = db.transaction("clubs", "readwrite");
        let store = tx.objectStore("clubs");
        store.add(data);
    })
}

const saveToFavorites = (data) => {
    dbPromised.then(db => {
        let tx = db.transaction("favorite-clubs", "readwrite");
        let store = tx.objectStore("favorite-clubs");
        store.add(data);
    })
}

const saveCompetitionStanding = (data) => {
    dbPromised.then(db => {
        let tx = db.transaction("standings", "readwrite");
        let store = tx.objectStore("standings");
        store.add(data);
    })
} 

const saveSchedules = (data) => {
    dbPromised.then(db => {
        let tx = db.transaction("schedules", "readwrite");
        let store = tx.objectStore("schedules");
        store.add(data);
    })
}

const getAll = () => {
    return new Promise((resolve, reject) => {
        dbPromised
        .then(db => {
            let tx = db.transaction("articles", "readonly");
            let store = tx.objectStore("articles");
            return store.getAll();
        })
        .then(articles => {
            resolve(articles);
        })
    })
}

function getById(id) {
    return new Promise(function(resolve, reject) {
      dbPromised
        .then(function(db) {
          var tx = db.transaction("articles", "readonly");
          var store = tx.objectStore("articles");
          return store.get(id);
        })
        .then(function(article) {
          resolve(article);
        });
    });
  }


