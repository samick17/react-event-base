const loadedLibs = {};

export function getLibs() {
    return loadedLibs;
};

export async function loadLib(src, id) {
	return new Promise((resolve, reject) => {
        if(id in loadedLibs) {
            resolve();
        } else {
            if(document.querySelector(`script#${id}`)) {
                resolve();
            } else {
                const script = document.createElement('script');
                loadedLibs[id] = script;
                script.setAttribute('id', id);
                script.setAttribute('charset', 'utf-8');
                script.setAttribute('type', 'text/javascript');
                script.onload = () => {
                    resolve();
                };
                script.onerror = (err) => {
                    reject(err);
                };
                script.src = src;
                document.head.append(script);
            }
        }
	});
}

export async function unloadLib(id) {
    if(id in loadedLibs) {
        loadedLibs[id].remove();
        delete loadedLibs[id];
    }
}

export async function unloadLibs(ids) {
    for(let i in ids) {
        let id = ids[i];
        unloadLib(id);
    }
}

export async function unloadAllLibs() {
    for(let id in loadedLibs) {
        unloadLib(id);
    }
}
