//Mohamed MOUKHLISSI



function negationFormule(formule) {
    // Appliquer les règles de négation
    let formuleNeg = negationRec(formule);
    
    // Retourner la formule négative
    return formuleNeg;
}
function negationRec(formule) {
    // Supprimer les espaces en excès
    formule = formule.replace(/\s+/g, '');

    // Vérifier si la formule est déjà une clause simple
    if (!formule.includes('v')) {
        return '~' + formule;
    } else {
        // Cas général
        return '~(' + formule + ')';
    }
}




// Exemple d'utilisation
let formule = "((~Pv~Q)vR) ⋀(~R) ⋀P ⋀(~TvQ)";
let formuleNeg = negationFormule(formule);
console.log("Négation de la formule : " + formuleNeg);

/*****************************************
 * 
 * chercher des clauses résolvantes
 * 
 * */ 

// Fonction pour mettre une formule logique sous forme d'un ensemble de clauses
function formuleToClauses(formule) {
    // Appliquer les règles de transformation en CNF
    let cnfClauses = cnfTransformation(formule);
    
    // Retourner l'ensemble de clauses
    return cnfClauses;
}

// Fonction de transformation en CNF (simplifiée pour l'exemple)
function cnfTransformation(formule) {
    // formule déjà en CNF
    let clauses = [];
    
    // Diviser la formule en sous-formules conjonctives
    let sousFormules = formule.split('⋀');

    // Parcourir chaque sous-formule
    sousFormules.forEach(sousFormule => {
        let literals = sousFormule.split('v');
        clauses.push(literals);
    });
    
    return clauses;
}


// Exemple d'utilisation

let clauses = formuleToClauses(formule);
console.log("Ensemble de clauses : ");
clauses.forEach(clause => {
    console.log(clause);
});

// Fonction pour chercher des clauses résolvantes
function chercherClausesResolvantes(clauses) {
    let resolvantes = [];
    
    // Parcourir toutes les paires de clauses
    for (let i = 0; i < clauses.length; i++) {
        for (let j = i + 1; j < clauses.length; j++) {
            let resolvent = resoudreClauses(clauses[i], clauses[j]);
            if (resolvent) {
                resolvantes.push(resolvent);
            }
        }
    }
    
    return resolvantes;
}

// Fonction pour résoudre deux clauses et générer une nouvelle clause
function resoudreClauses(clause1, clause2) {
    for (let literal1 of clause1) {
        for (let literal2 of clause2) {
            if (literal1 === "~" + literal2 || "~" + literal1 === literal2) {
                let newClause = [...clause1, ...clause2].filter(literal => literal !== literal1 && literal !== literal2);
                return newClause;
            }
        }
    }
    
    return null;
}

let resolvantes = chercherClausesResolvantes(clauses);
console.log("Clauses résolvantes trouvées : ");
resolvantes.forEach(resolvent => {
    console.log(resolvent);
});

/*****************************************
 * 
 * checker la formule
 * 
 * 
 * */ 


// Algorithme de résolution
function verifierValiditeFormule(formule) {
    let negation = negationFormule(formule);
    let clauses = formuleToClauses(negation);
    let resolvantes = chercherClausesResolvantes(clauses);
    
    let clausesCopy = [...clauses];
    
    for (let i = 0; i < clausesCopy.length && resolvantes.length > 0; i++) {
        let clause = clausesCopy[i];
        let resolvante = resolvantes[0];
        
        let clauseResolue = resoudreClauses(clause, resolvante);
        let resolvantesRestantes = resolvantes.slice(1);
        
        if (clauseResolue !== null && clauseResolue.length === 0)  {
            clausesCopy.splice(i, 1);
            resolvantes = chercherClausesResolvantes(clausesCopy);
            i = -1; // Réinitialiser l'index pour parcourir depuis le début
        } else if (clauseResolue !== null) {
            clausesCopy[i] = clauseResolue;
            resolvantes = chercherClausesResolvantes(clausesCopy);
            i = -1; // Réinitialiser l'index pour parcourir depuis le début
        } else {
            console.error("Clause résolue est null.");
            return false; 
        }
    }
    
    if (clausesCopy.some(clause => clause.length === 0)) {
        console.log("La formule est valide.");
        return true;
    } else {
        console.log("La formule est invalide.");
        return false;
    }
}

// Appeler la fonction verifierValiditeFormule avec la formule en entrée

verifierValiditeFormule(formule);

// Fonction pour résoudre la formule et afficher les résultats
function resolve() {
    let input = document.getElementById('input').value;
    let resultsList = document.getElementById('resultsList');
    
    // Appeler les fonctions pour obtenir les résultats
    let negation = negationFormule(input);
    let clauses = formuleToClauses(negation);
    let resolvantes = chercherClausesResolvantes(clauses);
    
    // Afficher les résultats dans la liste des résultats
    let resultItems = [
        `Négation de la formule : ${negation}`,
        `Ensemble de clauses : ${JSON.stringify(clauses)}`,
        `Clauses résolvantes trouvées : ${JSON.stringify(resolvantes)}`,
        `La formule "${input}" est ${verifierValiditeFormule(input) ? 'valide' : 'invalide'}.`
    ];
    
    // Supprimer les anciens résultats
    resultsList.innerHTML = '';
    
    // Créer des éléments li pour chaque résultat
    resultItems.forEach(item => {
        let resultItem = document.createElement('li');
        resultItem.textContent = item;
        resultsList.appendChild(resultItem);
    });
}

// Associer la fonction resolve au bouton Submit
document.getElementById('btnSubmit').addEventListener('click', resolve);

// Récupérer l'élément input
let inputElement = document.getElementById('input');

// Récupérer tous les boutons
let btnP = document.getElementById('btnP');
let btnQ = document.getElementById('btnQ');
let btnOpenParen = document.getElementById('btnOpenParen');
let btnCloseParen = document.getElementById('btnCloseParen');
let btnNegation = document.getElementById('btnNegation');
let btnAnd = document.getElementById('btnAnd');
let btnOr = document.getElementById('btnOr');
let btnImplication = document.getElementById('btnImplication');

// Ajouter des gestionnaires d'événements pour chaque bouton
btnP.addEventListener('click', () => {
    inputElement.value += 'P';
});

btnQ.addEventListener('click', () => {
    inputElement.value += 'Q';
});

btnOpenParen.addEventListener('click', () => {
    inputElement.value += '(';
});

btnCloseParen.addEventListener('click', () => {
    inputElement.value += ')';
});

btnNegation.addEventListener('click', () => {
    inputElement.value += '~';
});

btnAnd.addEventListener('click', () => {
    inputElement.value += '⋀';
});

btnOr.addEventListener('click', () => {
    inputElement.value += 'v';
});

btnImplication.addEventListener('click', () => {
    inputElement.value += '->';
});
