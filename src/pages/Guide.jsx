import React, { useState, useEffect } from 'react'
import { useTheme } from '../lib/ThemeContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import FooterApp from '../components/FooterApp'
import PageGuide from '../components/PageGuide'
import { usePageGuide } from '../lib/usePageGuide'

const CHAPITRES = [
  {
    num: '01',
    titre: "Comprendre l'environnement",
    couleur: '#3B82F6',
    resume: "Avant d'investir le moindre euro, comprends pourquoi ne pas agir est déjà une décision... et souvent la pire.",
    badgeSlug: 'guide-ch01',
    fiches: [
      {
        id: 1,
        titre: "L'inflation : L'ennemi invisible",
        texte: "L'inflation, c'est l'augmentation générale des prix chaque année. En France, elle tourne autour de 2 à 3% par an. Ça parait anodin. Mais sur le long terme, l'effet est dévastateur pour ton épargne. Laisser ton argent dormir sur un compte courant, c'est accepter de t'appauvrir lentement chaque année. Ton argent a le même nombre de zéros mais il achète moins. C'est silencieux, invisible et inévitable.",
        tableau: { cols: ['Situation', "Aujourd'hui", 'Dans 10 ans', 'Dans 20 ans'], rows: [['10 000€ immobilisés', '10 000€', '8 200€', '6 730€'], ["Pouvoir d'achat réel", '100%', '-18%', '-33%']] },
        tableauNote: '*Calcul basé sur une inflation moyenne de 2% par an.',
        challenge: "Calcule combien tu perds réellement chaque année avec ton épargne actuelle. Prends le montant total de ton épargne et multiplie par 2%, c'est ce que l'inflation te coûte chaque année.",
        app: "Rends-toi dans la page Portefeuille et saisis ton épargne actuelle. Tu verras immédiatement ce qui travaille pour toi et ce qui s'appauvrit.",
      },
      {
        id: 2,
        titre: "Le piège du Livret A : L'illusion de la sécurité",
        texte: "Beaucoup pensent que le Livret A protège leur argent. La réalité est plus nuancée. Le Livret A rapporte actuellement 1,7% par an. Si l'inflation dépasse ce taux (ce qui arrive régulièrement) ton argent perd du pouvoir d'achat chaque année malgré les intérêts. Le Livret A n'est pas un outil d'investissement. C'est un outil de sécurité. Parfait pour ton matelas de sécurité, mais chaque euro supplémentaire laissé dessus perd de la valeur réelle.",
        tableau: { cols: ['Situation', 'Taux', 'Résultat réel'], rows: [['Livret A', '1,7%/an', 'Positif si inflation < 1,7%'], ['Inflation moyenne', '~2-3%/an', "Tu perds du pouvoir d'achat"], ['Écart réel', '-0,3% à -1,3%', "Ton argent s'appauvrit lentement"]] },
        challenge: "Calcule le montant de ton matelas de sécurité idéal — entre 3 et 12 mois de charges fixes selon ton profil. Tout ce qui dépasse ce montant sur ton Livret A mérite mieux.",
        app: "Dans la page Portefeuille, définis ton matelas de sécurité selon ton profil de risque. Une fois constitué, chaque euro supplémentaire est prêt à travailler pour toi.",
      },
      {
        id: 3,
        titre: "Le risque de ne pas prendre de risque",
        texte: "Beaucoup de gens pensent que ne pas investir est la solution la plus sûre. C'est une illusion. Ne rien faire est déjà une décision — et souvent la pire. Le vrai risque, c'est de se réveiller dans 20 ans et de réaliser que tes économies ne permettent plus de maintenir ton niveau de vie.",
        tableau: { cols: ['Type de risque', 'Court terme', 'Long terme'], rows: [['Ne pas investir', 'Aucun stress', "Perte de pouvoir d'achat certaine"], ['Investir en ETF', 'Fluctuations normales', 'Croissance historique ~8%/an']] },
        challenge: null,
        app: "Dans la page Portefeuille, définis ton profil de risque à l'aide du plan de virement mensuel. Choisis où tu places ton épargne, en fonction de ta stratégie de %, entre la sécurité et l'investissement.",
        derniereFiche: false,
      },
      {
        id: 4,
        titre: "Le mythe du bon moment",
        texte: "\"J'attends que le marché baisse.\" \"J'attends d'avoir plus d'argent.\" \"J'attends d'en savoir plus.\" Ces phrases semblent raisonnables. Elles sont en réalité les plus coûteuses de toute une vie financière. Personne, ni les experts, ni les algorithmes, ni les banquiers, ne connaît le bon moment. Jamais.",
        tableau: { cols: ['Début à', 'Capital à 65 ans', 'Durée'], rows: [['25 ans', '~351 000€', '40 ans'], ['35 ans', '~150 000€', '30 ans'], ['45 ans', '~58 000€', '20 ans']] },
        tableauNote: '*Calcul basé sur 100€/mois à 8%/an.',
        citation: "Ton meilleur moment pour commencer c'était hier. Le deuxième meilleur moment, c'est maintenant.",
        challenge: null,
        app: "Dans le Journal d'investissements, note ta date de premier achat. Plus tu commences tôt, plus ta progression dans l'Ascension sera rapide. Chaque entrée compte.",
        derniereFiche: true,
      },
    ],
  },
  {
    num: '02',
    titre: "Stratégies d'investissement",
    couleur: '#4CAF2E',
    resume: "Comment investir intelligemment : Les concepts clés que tout débutant doit maîtriser.",
    badgeSlug: 'guide-ch02',
    fiches: [
      {
        id: 5,
        titre: "Lump Sum vs DCA : Quelle stratégie choisir ?",
        texte: "Quand on a de l'argent à investir, deux approches s'opposent. Laquelle choisir ? Tout dépend de ta situation, de ton budget et surtout de ta psychologie. Le DCA est la stratégie recommandée pour débuter. Simple, régulier, efficace sur le long terme. Tu investis le même montant chaque mois, mécaniquement, sans te demander si c'est le bon moment.",
        tableau: { cols: ['', 'Lump Sum', 'DCA'], rows: [['Principe', "Tu investis tout d'un coup", 'Tu investis un montant fixe chaque mois'], ['Avantages', 'Maximise le temps sur le marché', 'Réduit le risque de mal timing'], ['Inconvénients', "Risque d'acheter au mauvais moment", 'Rendement moins élevé en marché haussier'], ['Idéal pour', 'Capital important disponible', 'Débutant avec salaire mensuel']] },
        challenge: "Définis dès maintenant ton montant fixe mensuel, même 20€, même 50€. Note-le. C'est ton engagement DCA. Le montant importe peu, la régularité fait tout.",
        app: "Dans la page Portefeuille, programme ton plan de virement mensuel, même date, même montant. Une fois effectué, coche-le. Ensuite note ton achat dans le Journal d'investissements.",
      },
      {
        id: 6,
        titre: "L'effet boule de neige et les intérêts composés",
        texte: "Les intérêts composés, c'est le principe selon lequel tes intérêts génèrent eux-mêmes des intérêts. Ton argent grossit comme une boule de neige qui dévale une pente — lentement au début, puis de façon exponentielle.",
        tableau: { cols: ['Mensualité', '10 ans', '20 ans', '30 ans'], rows: [['50€/mois', '9 208€', '29 647€', '75 015€'], ['100€/mois', '18 417€', '59 295€', '150 030€'], ['200€/mois', '36 833€', '118 589€', '300 059€']] },
        tableauNote: '*Calcul basé sur un rendement annuel moyen de 8%.',
        challenge: "Calcule ta boule de neige personnelle. Prends ton montant mensuel × 12 × nombre d'années × rendement estimé à 8%. Compare avec ce que tu aurais sur un Livret A. La différence, c'est le coût de l'inaction.",
        app: "Dans la page Croissance, visualise ta boule de neige personnelle. L'app calcule automatiquement tes intérêts composés sur les années à venir en se basant sur ton taux d'épargne défini dans Mes Finances.",
      },
      {
        id: 7,
        titre: "L'importance de commencer tôt",
        texte: "En investissement, le temps est plus puissant que le montant. Quelqu'un qui commence à 25 ans avec 100€/mois aura plus du double de quelqu'un qui commence à 35 ans avec le même effort. Pas parce qu'il est plus intelligent. Parce qu'il a commencé plus tôt.",
        tableau: { cols: ['Début à', 'Capital à 65 ans', 'Durée'], rows: [['25 ans', '~351 000€', '40 ans'], ['35 ans', '~150 000€', '30 ans'], ['45 ans', '~58 000€', '20 ans']] },
        challenge: null,
        app: "Dans la page Croissance, l'app te montre exactement ce que ton épargne deviendra dans 10, 20 et 30 ans. Plus tu commences tôt, plus la courbe est impressionnante. C'est ta motivation visuelle au quotidien.",
      },
      {
        id: 8,
        titre: "Gérer ses émotions en période de baisse",
        texte: "Ton portefeuille vient de perdre 15%. La peur s'installe. L'envie de tout vendre devient irrésistible. C'est le moment le plus dangereux de ton parcours d'investisseur, pas à cause du marché, mais à cause de toi. Les émotions sont l'ennemi numéro un de la performance long terme.",
        tableau: { cols: ['Réaction face à une baisse', 'Résultat à long terme'], rows: [['Panique et vend tout', 'Perte définitive + manque la remontée'], ["Continue d'acheter", 'Achète moins cher et amplifie les gains'], ['Ne regarde pas et continue', 'Performance maximale sur le long terme']] },
        tableau2: { cols: ['Crise', 'Baisse max', 'Récupération', 'Ensuite'], rows: [['2008', '-57%', '4 ans', '+300% sur 10 ans'], ['Covid 2020', '-35%', '6 mois', '+100% en 2 ans']] },
        challenge: "Imagine que ton portefeuille perd 20% demain. Écris maintenant ce que tu vas faire. Vendre, tenir ou acheter davantage. C'est ton plan de crise personnel. Le jour où ça arrive tu suivras ton plan, pas tes émotions.",
        app: "Dans la page Croissance, visualise ta courbe de progression long terme. Quand le marché baisse, regarde cette courbe. Elle te rappelle où tu vas, pas où tu es aujourd'hui.",
        derniereFiche: true,
      },
    ],
  },
  {
    num: '03',
    titre: 'Choisir sa banque',
    couleur: '#F59E0B',
    resume: "Banque classique ou banque en ligne ? Et surtout, quelle enveloppe choisir ? Voici tout ce que tu dois savoir.",
    badgeSlug: 'guide-ch03',
    fiches: [
      {
        id: 9,
        titre: 'Banques classiques vs banques en ligne',
        texte: "Beaucoup investissent avec leur banque traditionnelle par habitude. C'est souvent une erreur coûteuse sur le long terme.",
        tableau: { cols: ['', 'Banques classiques', 'Banques en ligne'], rows: [['Frais de tenue', '5 à 25€/mois', 'Gratuit'], ['Frais de courtage', '0,5 à 1,5%', '0,1 à 0,5%'], ['Gamme de produits', 'Limitée', 'Complète'], ['Interface mobile', 'Souvent vieillissante', 'Moderne et intuitive']] },
        challenge: "Vérifie les frais de courtage de ta banque actuelle. Combien te coûte un ordre d'achat de 100€ ? Multiplie par 12 ordres par an pendant 30 ans. C'est ce que tu peux économiser en passant à une banque en ligne.",
        app: "Dans le Journal d'investissements, renseigne le TER de chaque ETF et les frais de courtage saisis par tes soins. L'app calcule l'impact réel des frais sur ta performance réelle.",
      },
      {
        id: 10,
        titre: 'CTO vs PEA : Comprendre la différence',
        texte: "Avant de choisir ta plateforme, il faut comprendre les deux grandes enveloppes d'investissement disponibles en France. Ce choix impacte directement combien tu paies en impôts sur tes gains.",
        tableau: { cols: ['', 'CTO', 'PEA'], rows: [['Plafond', 'Illimité', '150 000€'], ['Fiscalité', 'Flat tax 31,4%', "Exonéré d'IR après 5 ans — 18,6%"], ['Produits', 'Tout. Actions monde, ETF, obligations', 'Actions et ETF européens uniquement'], ['Retrait', 'À tout moment', 'Libre mais perte avantage avant 5 ans']] },
        challenge: "Tu as un PEA ouvert ? Si non, c'est ton prochain objectif. L'ouvrir ne coûte rien et le compteur des 5 ans commence dès l'ouverture, même avec 1€ dessus.",
        app: "Dans le Journal d'investissements, indique l'enveloppe utilisée (PEA ou CTO) ainsi que le courtier associé pour chaque achat.",
      },
        {
        id: 11,
        titre: 'Comparatif des meilleures plateformes',
        texte: "Un courtier est l'intermédiaire qui te permet d'acheter et de vendre des actifs financiers en bourse. Sans lui, impossible d'investir. Concrètement, c'est lui qui détient tes titres, exécute tes ordres et te fournit les enveloppes fiscales comme le PEA ou le CTO. En France, tous les courtiers sont régulés par l'AMF, ce qui garantit la sécurité de tes fonds. Mais au-delà de la sécurité, les différences sont énormes : frais de courtage, gamme de produits, qualité de l'interface, enveloppes proposées, service client. Un mauvais choix peut te coûter des milliers d'euros sur 10 ou 20 ans. Un bon choix, c'est celui qui colle à ton profil, ton niveau et ta stratégie.",
        tableau: {
          cols: ['Plateforme', 'Enveloppes', 'Frais ETF', 'Profil idéal', 'Points forts', 'Points faibles'],
          rows: [
            ['Trade Republic', 'PEA + CTO', '1€/ordre (gratuit en DCA)', 'Débutant / Mobile', 'Ultra simple, DCA auto, fractions dès 1€', 'Univers limité, spreads possibles'],
            ['XTB', 'PEA + CTO', '0% jusqu\'à 100k€/mois', 'Débutant / Intermédiaire', 'Frais imbattables, screener intégré', 'Interface complexe pour débutants'],
            ['Revolut', 'CTO uniquement', '0% (quota mensuel selon abonnement)', 'Débutant / Nomade', 'App simple, DCA auto, fractions dès 1€', 'Pas de PEA, quota limité, régulé en Lituanie'],
            ['Bourse Direct', 'PEA + CTO', '0,99€/ordre', 'Investisseur régulier', 'Le moins cher de France, fiable, idéal PEA', 'Interface vieillissante, service client lent'],
            ['Bourso Bank', 'PEA + CTO', '0% ETF sélectionnés', 'Banque principale', 'Gratuit sur ETF sélectionnés, banque complète', 'Frais élevés marchés étrangers (min. 50€)'],
            ['Fortuneo', 'PEA + CTO', '0,20% (min. 20€)', 'Intermédiaire', 'Bon équilibre frais/service, PEA-PME, IFU fiable', 'Frais élevés pour gros ordres'],
            ['Degiro', 'CTO uniquement', 'Dès 0,50€', 'Intermédiaire / CTO', 'Grande gamme internationale, frais bas', 'Pas de PEA, régulé aux Pays-Bas'],
            ['Interactive Brokers', 'PEA + CTO', 'Dès 1,25€ (0,05%)', 'Expérimenté / Gros capital', 'Marchés mondiaux, frais dégressifs, le plus complet', 'Interface complexe, pas pour débutants'],
            ['Saxo Bank', 'PEA + CTO', '0,08% (min. 2€)', 'Expérimenté', 'Frais bas sur gros ordres, levier SRD disponible', 'Complexe, orienté professionnel'],
            ['Linxea Spirit', 'Assurance-vie', '0% UC', 'Épargne long terme', 'Meilleure AV en ligne, fonds euros + ETF', 'Pas de PEA ni CTO, uniquement AV'],
          ]
        },
        texte2: [
          "Choisir son courtier, c'est une décision que tu prendras une seule fois — et qui t'accompagnera pendant des années. Voici les 5 critères essentiels pour faire le bon choix.",
          "Tes convictions et ta stratégie. Tu veux investir uniquement en ETF en mode DCA passif ? Ou tu comptes aussi acheter des actions en direct ? Définis ta stratégie avant de choisir ton courtier — pas l'inverse.",
          "Ton niveau et l'interface. Si tu débutes, une interface simple comme Trade Republic ou XTB sera bien plus adaptée qu'une plateforme pro comme Interactive Brokers. Teste les apps avant de te décider.",
          "Les enveloppes proposées. PEA, CTO, Assurance-vie — tous les courtiers ne proposent pas toutes les enveloppes. Si tu veux un PEA (et tu devrais, pour la fiscalité), assure-toi que le courtier le propose.",
          "Les frais de courtage. C'est le critère le plus impactant sur le long terme. Un frais fixe de 1€/ordre est idéal pour les petits investisseurs réguliers. Calcule toujours le coût réel selon ton montant mensuel.",
          "La fiabilité et le service client. Un courtier français comme Bourse Direct ou Fortuneo a l'avantage de fournir un IFU fiable et un service client francophone.",
        ],
        challenge: null,
        app: "Dans le Journal d'investissements, renseigne l'enveloppe — PEA, CTO ou AV — le courtier et tes frais de courtage réels. L'app calcule automatiquement l'impact sur ta performance nette.",
        derniereFiche: true,
      },
    ],
  },
  {
    num: '04',
    titre: 'Les bases essentielles',
    couleur: '#8B5CF6',
    resume: "Ce que tout investisseur débutant doit absolument maîtriser avant de passez à l'action.",
    badgeSlug: 'guide-ch04',
    fiches: [
      {
        id: 12,
        titre: 'Le matelas de sécurité : Non négociable',
        texte: "Avant d'investir le moindre euro, une étape est absolument indispensable. Constituer ton matelas de sécurité. C'est une somme d'argent liquide, accessible immédiatement, qui te permet de faire face aux imprévus sans jamais toucher à tes investissements. L'idéal est entre 3 et 12 mois de charges fixes selon ton profil.",
        tableau: { cols: ['Placement', 'Disponibilité', 'Rendement', 'Recommandé ?'], rows: [['Compte courant', 'Immédiate', '0%', 'Non'], ['Livret A', 'Immédiate', '1,7%', 'Idéal'], ['LDDS', 'Immédiate', '1,7%', 'Complément'], ['LEP', 'Immédiate', '3,5%', 'Si éligible']] },
        challenge: "Calcule ton matelas idéal. Additionne toutes tes charges fixes mensuelles et multiplie par le nombre de mois adapté à ton profil. C'est ton objectif prioritaire avant tout investissement.",
        app: "Dans la page Portefeuille, définis ton matelas de sécurité selon ton profil de risque. L'app t'indique si ton matelas est constitué et quand tu peux commencer à investir sereinement.",
      },
      {
        id: 13,
        titre: 'La fiscalité : Comprendre comment tu es imposé',
        texte: "Par défaut en France, tes gains financiers sont soumis au PFU (Prélèvement Forfaitaire Unique) aussi appelé flat tax.",
        tableau: { cols: ['Composante', 'Taux'], rows: [['Impôt sur le revenu', '12,8%'], ['Prélèvements sociaux (CSG/CRDS)', '18,6%'], ['TOTAL PFU — Flat Tax 2026', '31,4%']] },
        tableau2: { cols: ['Tranche marginale', 'Flat Tax', 'Barème progressif', 'Meilleur choix'], rows: [['0%', '31,4%', '18,6%', 'Barème'], ['11%', '31,4%', '29,6%', 'Barème'], ['30%+', '31,4%', '48,6%+', 'Flat Tax']] },
        note: "Déclaration comptes étrangers. Formulaire 3916 obligatoire pour les compgtes à l'étranger (Degiro, IBKR, etc...). Amende 1 500€ par compte non déclaré.",
        challenge: null,
        app: "Dans le Journal d'investissements, renseigne ton enveloppe fiscale (PEA ou CTO) pour chaque achat. L'app calcule l'impact fiscal réel sur ta performance et t'aide à optimiser ta stratégie.",
      },
      {
        id: 14,
        titre: "L'IFU et la déclaration annuelle",
        texte: "Chaque année entre janvier et mars, ton courtier t'envoie un IFU (Imprimé Fiscal Unique). C'est le document officiel qui récapitule tous tes gains financiers de l'année.",
        tableau: { cols: ['Étape', 'Action', 'Où'], rows: [['1', "Reçois ton IFU", 'Email ou espace client courtier'], ['2', 'Connecte-toi sur impots.gouv.fr', 'Rubrique Déclarer'], ['3', 'Vérifie les cases pré-remplies', 'Courtier français = automatique'], ['4', 'Vérifie la case 2OP', 'Si TMI 0% ou 11%'], ['5', 'Déclare les comptes étrangers', 'Formulaire 3916']] },
        challenge: "Retrouve ton dernier IFU dans ton espace client courtier. Si c'est ta première année — note la date limite de déclaration dans ton calendrier dès maintenant.",
        app: "Dans le Journal d'investissements, chaque vente que tu notes génère une plus-value ou moins-value tracée par l'app. En fin d'année tu as un récapitulatif de tes gains réalisés pour faciliter ta déclaration.",
      },
      {
        id: 15,
        titre: "Les ETF : L'outil idéal pour débuter",
        texte: "Un ETF (Exchange Traded Fund) est un fonds d'investissement qui réplique automatiquement la performance d'un indice boursier. Par exemple, un ETF World investit en une seule fois dans les 1 500 plus grandes entreprises mondiales.",
        tableau: { cols: ['Critère', "Ce qu'il faut vérifier", 'Seuil idéal'], rows: [['TER (frais annuels)', "Plus c'est bas mieux c'est", '< 0,30%/an'], ['Taille du fonds', 'Un fonds trop petit peut fermer', '> 500 millions €'], ['Éligibilité PEA', "Pour l'avantage fiscal", 'Vérifier sur site émetteur'], ['Frais de courtage', "Frais à l'achat", '< 0,5% par ordre'], ['Réplication', 'Physique = détient vraiment les actions', 'Physique recommandé']] },
        challenge: "Recherche un ETF MSCI World éligible PEA sur justetf.com avec un TER inférieur à 0,40%. Vérifie sa taille et son ancienneté. Si tout est bon — c'est ton candidat pour ton premier achat.",
        app: "Dans le Journal d'investissements, ajoute ton premier achat en saisissant simplement le ticker de ton ETF — l'app trouve automatiquement son nom et son TER.",
      },
      {
        id: 16,
        titre: "La diversification : Ne jamais mettre tous ses œufs dans le même panier",
        texte: "La diversification consiste à répartir ses investissements sur différents actifs, secteurs et zones géographiques pour réduire le risque sans nécessairement réduire le rendement.",
        tableau: { cols: ['Niveau', 'Exemple', 'Risque'], rows: [['Mauvais', '100% sur une seule action', 'Très élevé'], ['Moyen', '10 actions dans 1 secteur', 'Élevé'], ['Bon', 'ETF Europe + ETF USA + ETF Emergents', 'Modéré'], ['Excellent', 'ETF World + Obligations + SCPI', 'Faible']] },
        challenge: null,
        app: "Dans la page Investissements, consulte ton tableau des allocations pour visualiser la répartition de tes ETF. Diversifie sur 3 ETF différents et débloque ton badge Diversification.",
      },
      {
        id: 17,
        titre: "Les frais : L'ennemi silencieux de ta performance",
        texte: "Les frais sont invisibles au quotidien mais dévastateurs sur le long terme. Sur 30 ans d'investissement, la différence entre 0,2% et 2% de frais annuels peut représenter des dizaines de milliers d'euros de moins sur ton patrimoine.",
        tableau: { cols: ['Frais annuels', '10 000€ investis', 'Dans 30 ans'], rows: [['0,2% (ETF en ligne)', '10 000€', '~93 000€'], ['1% (banque en ligne)', '10 000€', '~76 000€'], ['2% (banque classique)', '10 000€', '~57 000€']] },
        tableauNote: '*Calcul basé sur un rendement brut de 8%/an.',
        challenge: "Calcule tes frais totaux annuels, TER de ton ETF + frais de courtage × nombre d'ordres par an. C'est le coût réel de ta stratégie. Si ça dépasse 1% tu peux probablement optimiser.",
        app: "Dans le Journal d'investissements, renseigne le TER de chaque ETF et les frais de courtage. L'app calcule automatiquement l'impact total des frais sur ta performance nette.",
        derniereFiche: true,
      },
    ],
  },
  {
    num: '05',
    titre: "Passez à l'action",
    couleur: '#EC4899',
    resume: "Investir intelligemment ne prend pas des heures. Avec la bonne méthode, 15 minutes par mois suffisent.",
    badgeSlug: 'guide-ch05',
    fiches: [
      {
        id: 18,
        titre: 'Construire sa stratégie personnelle',
        texte: "Investir sans stratégie c'est naviguer sans boussole. Avant de choisir un ETF ou d'ouvrir un compte, tu dois répondre honnêtement à trois questions fondamentales. Note tes réponses ci-dessous, elles seront sauvegardées et toujours disponibles.",
        tableau: { cols: ['Profil', 'Tu te reconnais ?', 'Répartition recommandée'], rows: [['Prudent', 'Je veux avant tout protéger mon capital', '30% ETF + 70% sécurité'], ["Équilibré", "J'accepte quelques fluctuations", '60% ETF + 40% sécurité'], ['Dynamique', 'Je vise la performance maximale', '90% ETF + 10% sécurité']] },
        strategie: true,
        challenge: "Réponds aux 3 questions maintenant : horizon, montant mensuel, profil de risque. Écris tes réponses et récupère ton badge. C'est ta stratégie personnelle.",
        app: "Dans la page Portefeuille, définis tes virements mensuels par enveloppe (PEA, CTO, Assurance-vie). Ensuite dans la page Investissements, utilise le tableau des allocations pour définir le pourcentage de chaque ETF.",
      },
      {
        id: 19,
        titre: 'Trouver les bons ETF',
        texte: "Il existe des milliers d'ETF disponibles sur les marchés. Pour un débutant, trouver les bons peut sembler intimidant. Voici les sites et outils concrets pour identifier les ETF adaptés à ta stratégie.",
        tableau: { cols: ['Site', 'Utilité', 'Gratuit ?'], rows: [['justetf.com', 'Meilleur comparateur ETF Europe', 'Oui'], ['morningstar.fr', 'Fiches détaillées et notation', 'Partiellement'], ['bourse.fr', "Vérifier l'éligibilité PEA", 'Oui'], ['trackinsight.com', 'Comparateur avancé', 'Oui']] },
        tableau2: { cols: ['ETF', 'Indice', 'TER', 'PEA ?'], rows: [['Amundi MSCI World', 'MSCI World', '0,38%', 'Oui'], ['Lyxor MSCI World', 'MSCI World', '0,30%', 'Oui'], ['Amundi S&P 500', 'S&P 500', '0,15%', 'Oui'], ['iShares MSCI World', 'MSCI World', '0,20%', 'Oui']] },
        challenge: "Va sur justetf.com et recherche un ETF MSCI World éligible PEA avec un TER inférieur à 0,30%. Vérifie sa taille et son ancienneté. Si tout est bon, c'est ton candidat.",
        app: "Dans la page Investissements, saisis le ticker de ton ETF. L'app trouve automatiquement son nom et son TER. Définis son pourcentage dans ton tableau des allocations.",
      },
      {
        id: 20,
        titre: 'Choisir son courtier',
        texte: "Ton courtier c'est la plateforme où tu vas acheter et vendre tes ETF. Ce choix impacte directement tes frais, ta fiscalité et ton expérience au quotidien.",
        tableau: { cols: ['Document', 'Obligatoire ?'], rows: [["Pièce d'identité (CNI ou passeport)", 'Toujours'], ['Justificatif de domicile -3 mois', 'Toujours'], ['RIB de ton compte bancaire', 'Toujours'], ['Numéro fiscal', 'Pour le PEA']] },
        challenge: "Choisis ton courtier maintenant. Ouvre ton compte aujourd'hui. Tu as 30 minutes devant toi et tous les documents nécessaires listés ci-dessus.",
        app: "Dans le Journal d'investissements, renseigne l'enveloppe (PEA ou CTO) le courtier et tes frais de courtage réels pour chaque achat.",
      },
      {
        id: 21,
        titre: "Passer son premier ordre d'achat",
        texte: "Tu as ta stratégie, ton ETF et ton courtier. Il est temps de passer ton premier ordre d'achat. Voici exactement comment faire pas à pas.",
        tableau: { cols: ["Type d'ordre", 'Comment ça fonctionne', "Quand l'utiliser"], rows: [['Ordre au marché', 'Tu achètes immédiatement au prix actuel', 'Idéal pour débuter'], ['Ordre limité', 'Tu fixes le prix maximum que tu acceptes', "Pour maîtriser son prix d'achat"]] },
        tableau2: { cols: ['Étape', 'Action'], rows: [['1', 'Connecte-toi à ton courtier'], ['2', 'Recherche ton ETF via son ticker — ex: CW8'], ['3', 'Clique sur Acheter'], ['4', "Choisis l'ordre au marché"], ['5', 'Saisis le montant en euros'], ['6', 'Vérifie le récapitulatif et confirme']] },
        challenge: "Passe ton premier ordre aujourd'hui. Même 20€. Même 50€. Le montant importe peu, ce qui compte c'est de franchir ce cap psychologique.",
        app: "Dès ton ordre passé, note-le immédiatement dans le Journal d'investissements. Ticker, montant, enveloppe, courtier et frais. C'est ton premier pas dans ton Ascension.",
      },
      {
        id: 22,
        titre: 'Les arnaques à éviter',
        texte: "Plus tu t'intéresses à l'investissement, plus tu vas croiser des opportunités qui semblent trop belles pour être vraies. Spoiler, elles le sont. La règle d'or : aucun investissement légal et sérieux ne garantit un rendement fixe. Quiconque te promet 10%, 15% ou 20% par an de façon garantie est soit un menteur soit un escroc.",
        tableau: { cols: ["Signal d'alarme", 'Ce que ça veut dire'], rows: [['Rendement garanti', 'Impossible en investissement légal'], ['Urgence et pression', '"C\'est maintenant ou jamais"'], ["Pas enregistré à l'AMF", 'Illégal en France'], ["Récupérer son argent est compliqué", 'Arnaque quasi certaine'], ['Trop beau pour être vrai', "C'est que ça ne l'est pas"]] },
        challenge: "Va sur amf-france.org et consulte la liste noire des sites et personnes interdits d'exercice en France. Garde ce site en favori — c'est ton premier réflexe avant tout nouvel investissement.",
        app: "Start Invest est construit sur une approche éducative et transparente, pas de promesses de gains miraculeux. Juste une promesse honnête. Te donner la sérénité et la confiance pour construire ton avenir financier en toute autonomie.",
      },
      {
        id: 23,
        titre: 'Le rééquilibrage : Rester fidèle à sa stratégie',
        texte: "Au fil du temps, certains ETF performent mieux que d'autres et leur poids dans ton portefeuille augmente naturellement. Le rééquilibrage consiste à corriger ça : ramener chaque ETF à son pourcentage cible.",
        tableau: { cols: ['ETF', 'Cible', 'Après 1 an', 'Action'], rows: [['ETF World', '70%', '80%', 'Investir moins ce mois'], ['ETF Émergents', '20%', '15%', 'Investir davantage'], ['ETF Obligations', '10%', '5%', 'Investir davantage']] },
        tableau2: { cols: ['Approche', 'Fréquence', 'Idéal pour'], rows: [['Par le flux', 'À chaque achat mensuel', 'Débutant, sans vendre donc sans impôt'], ['Périodique', '1 fois par trimestre', 'Portefeuille plus mature'], ['Par seuil', "Quand un ETF dépasse de 5-10%", 'Investisseur avancé']] },
        challenge: "Définis ta répartition cible maintenant. ex: 70% ETF World, 20% ETF S&P500, 10% ETF Émergents. Note ces pourcentages. C'est ta boussole.",
        app: "Dans la page Investissements, renseigne le pourcentage cible de chaque ETF dans ton tableau des allocations. L'app compare automatiquement ta répartition réelle avec ta stratégie de départ et t'indique quel ETF ajuster lors de ton prochain achat mensuel.",
        derniereFiche: true,
      },
    ],
  },
]

// ─── Tableau générique ────────────────────────────────────────────────────────
function TableauFiche({ tableau }) {
  const t = useTheme()
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, border: `0.5px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <thead>
          <tr>
            {tableau.cols.map((col, i) => (
              <th key={i} style={{ background: t.bgSecondary, padding: '8px 12px', textAlign: 'left', fontWeight: 500, color: t.textSecondary, fontSize: 11, borderBottom: `0.5px solid ${t.border}`, whiteSpace: 'nowrap' }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableau.rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 1 ? t.bgSecondary : 'transparent' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '8px 12px', borderBottom: i < tableau.rows.length - 1 ? `0.5px solid ${t.border}` : 'none', color: t.text, fontSize: 12 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Section stratégie fiche 18 ───────────────────────────────────────────────
function SectionStrategie({ couleur }) {
  const t = useTheme()
  const PROFILS = ['Prudent — 30% ETF + 70% sécurité', 'Équilibré — 60% ETF + 40% sécurité', 'Dynamique — 90% ETF + 10% sécurité']
  const [form, setForm] = useState({ horizon: '', montant_mensuel: '', profil_risque: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    const charger = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('strategies').select('*').eq('user_id', user.id).single()
      if (data) setForm({ horizon: data.horizon || '', montant_mensuel: data.montant_mensuel || '', profil_risque: data.profil_risque || '', notes: data.notes || '' })
    }
    charger()
  }, [])

  const sauvegarder = async () => {
    setLoading(true); setErreur(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non connecté')
      const payload = { user_id: user.id, horizon: form.horizon, montant_mensuel: form.montant_mensuel, profil_risque: form.profil_risque, notes: form.notes, updated_at: new Date().toISOString() }
      const { data: existing } = await supabase.from('strategies').select('id').eq('user_id', user.id).single()
      const { error } = existing ? await supabase.from('strategies').update(payload).eq('user_id', user.id) : await supabase.from('strategies').insert(payload)
      if (error) throw new Error('Erreur lors de la sauvegarde.')
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e) { setErreur(e.message) } finally { setLoading(false) }
  }

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `0.5px solid ${t.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: t.bgSecondary, color: t.text, boxSizing: 'border-box' }

  return (
    <div style={{ background: t.bgSecondary, border: `0.5px solid ${couleur}25`, borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: t.text }}>Ma stratégie personnelle</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: t.textSecondary, marginBottom: 6 }}>1. Sur quel horizon souhaites-tu investir ?</div>
        <select value={form.horizon} onChange={e => setForm({ ...form, horizon: e.target.value })} style={inputStyle}>
          <option value="">Sélectionne ton horizon</option>
          <option value="Moins de 5 ans">Moins de 5 ans</option>
          <option value="5 à 10 ans">5 à 10 ans</option>
          <option value="10 à 20 ans">10 à 20 ans</option>
          <option value="Plus de 20 ans">Plus de 20 ans</option>
        </select>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: t.textSecondary, marginBottom: 6 }}>2. Quel montant mensuel peux-tu investir ?</div>
        <input type="text" placeholder="ex: 100€/mois" value={form.montant_mensuel} onChange={e => setForm({ ...form, montant_mensuel: e.target.value })} style={inputStyle} />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: t.textSecondary, marginBottom: 8 }}>3. Quel est ton profil de risque ?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PROFILS.map((profil) => (
            <div key={profil} onClick={() => setForm({ ...form, profil_risque: profil })} style={{ padding: '10px 14px', borderRadius: 8, border: `0.5px solid ${form.profil_risque === profil ? couleur : t.border}`, background: form.profil_risque === profil ? couleur + '12' : t.bgCard, cursor: 'pointer', fontSize: 12, color: form.profil_risque === profil ? couleur : t.text, fontWeight: form.profil_risque === profil ? 500 : 400, transition: 'all 0.15s' }}>
              {profil}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: t.textSecondary, marginBottom: 6 }}>Notes complémentaires (optionnel)</div>
        <textarea placeholder="Ex: Je veux investir dans un ETF World en PEA chez Bourso Bank..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} />
      </div>
      {erreur && <div style={{ background: '#FCEBEB', border: '0.5px solid #E24B4A', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#E24B4A' }}>⚠️ {erreur}</div>}
      {saved && <div style={{ background: '#EAF6E4', border: '0.5px solid rgba(76,175,46,0.25)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#2E7D1E' }}>✓ Stratégie sauvegardée !</div>}
      <button onClick={sauvegarder} disabled={loading} style={{ background: loading ? '#9CA3AF' : '#4CAF2E', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
        {loading ? '⏳ Sauvegarde...' : 'Sauvegarder ma stratégie'}
      </button>
    </div>
  )
}

// ─── Bouton validation chapitre ───────────────────────────────────────────────
function BoutonValidationChapitre({ chapitre, onValide }) {
  const t = useTheme()
  const [loading, setLoading] = useState(false)
  const [deja, setDeja] = useState(false)
  const [succes, setSucces] = useState(false)

  useEffect(() => {
    const verifier = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('accomplissements').select('id').eq('user_id', user.id).eq('slug', chapitre.badgeSlug).maybeSingle()
      if (data) setDeja(true)
    }
    verifier()
  }, [chapitre.badgeSlug])

  const valider = async () => {
  if (loading || deja) return
  setLoading(true)
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: existing } = await supabase.from('accomplissements').select('id').eq('user_id', user.id).eq('slug', chapitre.badgeSlug).maybeSingle()
    if (!existing) {
      const { error } = await supabase.from('accomplissements').insert({ user_id: user.id, slug: chapitre.badgeSlug })
      if (error) throw error
    }
    
    // Mettre à jour badges_non_vus
    const { data: profil } = await supabase
      .from('profils')
      .select('badges_non_vus')
      .eq('user_id', user.id)
      .maybeSingle()
    const badgesNonVus = profil?.badges_non_vus ?? []
    const { error: updateError } = await supabase
  .from('profils')
  .update({ badges_non_vus: [...badgesNonVus, chapitre.badgeSlug] })
  .eq('user_id', user.id)
console.log("update error:", updateError)
console.log("profil trouvé:", profil)
    console.log("badges_non_vus mis à jour:", chapitre.badgeSlug)

    setDeja(true)
    setSucces(true)
    if (onValide) onValide(chapitre.badgeSlug)
  } catch (e) {
    console.error(e)
  } finally {
    setLoading(false)
  }
}

  if (deja) return (
    <div style={{ background: chapitre.couleur + '15', border: `0.5px solid ${chapitre.couleur}40`, borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: chapitre.couleur, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>✓</span>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: chapitre.couleur }}>Chapitre validé !</div>
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Badge "{chapitre.titre}" débloqué dans tes accomplissements.</div>
      </div>
    </div>
  )

  return (
    <div style={{ background: t.bgSecondary, border: `0.5px solid ${chapitre.couleur}30`, borderRadius: 10, padding: '14px 16px' }}>
      {succes && (
        <div style={{ background: '#EAF6E4', border: '0.5px solid #4CAF2E40', borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontSize: 12, color: '#2E7D1E', fontWeight: 500 }}>
          🎉 Badge débloqué ! Retrouve-le dans la page Challenge.
        </div>
      )}
      <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>
        Tu as lu et compris toutes les fiches de ce chapitre ? Valide-le pour débloquer ton badge <span style={{ fontWeight: 600, color: chapitre.couleur }}>"{chapitre.titre}"</span>.
      </div>
      <button
        onClick={valider}
        disabled={loading}
        style={{ width: '100%', background: loading ? '#9CA3AF' : chapitre.couleur, color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s' }}
      >
        {loading ? '⏳ Validation...' : '🏆 J\'ai bien compris — Valider ce chapitre'}
      </button>
    </div>
  )
}

// ─── Popup fiche ──────────────────────────────────────────────────────────────
function PopupFiche({ fiche, chapitre, onClose, onChapitreValide }) {
  const t = useTheme()
  if (!fiche) return null
  const estDerniereFiche = fiche.derniereFiche === true

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose() }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
      <div style={{ background: t.bgCard, borderRadius: 16, border: `0.5px solid ${t.border}`, width: '100%', maxWidth: 620, maxHeight: '88vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Header sticky */}
        <div style={{ padding: '18px 20px 14px', borderBottom: `0.5px solid ${t.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, position: 'sticky', top: 0, background: t.bgCard, zIndex: 1, borderRadius: '16px 16px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: chapitre.couleur + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: chapitre.couleur, flexShrink: 0 }}>
              {String(fiche.id).padStart(2, '0')}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>{fiche.titre}</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Partie {chapitre.num} — {chapitre.titre}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: t.bgSecondary, border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 16, cursor: 'pointer', color: t.textSecondary, lineHeight: 1, flexShrink: 0, fontFamily: 'inherit' }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.7 }}>{fiche.texte}</p>

{fiche.texte2 && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: t.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comment bien choisir son courtier ?</div>
    {fiche.texte2.map((para, i) => (
      <p key={i} style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.7, margin: 0 }}>{para}</p>
    ))}
  </div>
)}

          {fiche.tableau && <TableauFiche tableau={fiche.tableau} />}
          {fiche.tableauNote && <p style={{ fontSize: 11, color: t.textMuted, marginTop: -6 }}>{fiche.tableauNote}</p>}
          {fiche.tableau2 && <TableauFiche tableau={fiche.tableau2} />}

          {fiche.note && (
            <div style={{ background: t.bgSecondary, border: `0.5px solid ${t.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 12, color: t.textSecondary, lineHeight: 1.5 }}>{fiche.note}</div>
          )}

          {fiche.citation && (
            <div style={{ borderLeft: `3px solid ${chapitre.couleur}`, padding: '10px 14px', fontSize: 13, color: t.textSecondary, fontStyle: 'italic', lineHeight: 1.6 }}>"{fiche.citation}"</div>
          )}

          {fiche.strategie && <SectionStrategie couleur={chapitre.couleur} />}

          {fiche.challenge && (
            <div style={{ background: '#EAF6E4', border: '0.5px solid rgba(76,175,46,0.25)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#2E7D1E', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Challenge</div>
              <div style={{ fontSize: 12, color: '#2E7D1E', lineHeight: 1.6 }}>{fiche.challenge}</div>
            </div>
          )}

          {fiche.app && (
            <div style={{ background: '#E8EEF6', border: '0.5px solid rgba(27,46,75,0.15)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#034065', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Dans Start Invest</div>
              <div style={{ fontSize: 12, color: '#034065', lineHeight: 1.6 }}>{fiche.app}</div>
            </div>
          )}

          {/* Bouton validation chapitre — uniquement sur la dernière fiche */}
          {estDerniereFiche && (
            <BoutonValidationChapitre chapitre={chapitre} onValide={onChapitreValide} />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function Guide() {
  const t = useTheme()
  const { showGuide, ouvrirGuide, fermerGuide } = usePageGuide()
  const [user, setUser] = useState(null)
  const [photoUrl, setPhotoUrl] = useState(null)

useEffect(() => {
  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      setPhotoUrl(user.user_metadata?.photo_url || null)
    }
  }
  loadUser()
}, [])

const initiale = user?.user_metadata?.prenom?.[0]?.toUpperCase() || '?'
const GUIDE_GUIDE = [
  {
    titre: '🎓 Les bases, sans jargon',
    description: 'Comprends les fondamentaux de l\'investissement simplement et clairement. ETF, PEA, DCA, intérêts composés... Tout est expliqué pour que tu puisses avancer sans te perdre.',
  },
  {
    titre: '🧭 La stratégie',
    description: 'Investir sans stratégie, c\'est naviguer sans boussole. Découvre comment construire un portefeuille solide, adapté à ton profil et à tes objectifs long terme.',
  },
  {
    titre: '🧠 La bonne mentalité',
    description: 'La clé du succès en investissement ce n\'est pas de choisir les bonnes actions, c\'est la constance, la patience et la discipline. Apprends à ignorer le bruit du marché et à rester sur ta trajectoire.',
  },
  {
    titre: '🚀 Passe à l\'action',
    description: 'Tu as les bases, la stratégie et la mentalité. Il ne manque plus qu\'une chose : commencer. Chaque euro investi aujourd\'hui travaille pour ton futur.',
  },
]
  const [ficheOuverte, setFicheOuverte] = useState(null)
  const [chapitreOuvert, setChapitreOuvert] = useState(null)
  const [chapitresValides, setChapitresValides] = useState(new Set())

  // Charger les chapitres déjà validés
  useEffect(() => {
    const charger = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const slugsGuide = ['guide-ch01', 'guide-ch02', 'guide-ch03', 'guide-ch04', 'guide-ch05']
      const { data } = await supabase.from('accomplissements').select('slug').eq('user_id', user.id).in('slug', slugsGuide)
      if (data) setChapitresValides(new Set(data.map(a => a.slug)))
    }
    charger()
  }, [])

  const ouvrirFiche = (fiche, chapitre) => { setFicheOuverte(fiche); setChapitreOuvert(chapitre) }
  const fermerFiche = () => { setFicheOuverte(null); setChapitreOuvert(null) }
  const onChapitreValide = (slug) => setChapitresValides(prev => new Set([...prev, slug]))

  return (
    <div style={{ background: t.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      {ficheOuverte && <PopupFiche fiche={ficheOuverte} chapitre={chapitreOuvert} onClose={fermerFiche} onChapitreValide={onChapitreValide} />}

      <Navbar page="Guide" initiale={initiale} photoUrl={photoUrl} />
      <PageGuide
  pageId="guide"
  titre="Guide"
  etapes={GUIDE_GUIDE}
  forceVisible={showGuide}
  onClose={fermerGuide}
/>
<button
  onClick={ouvrirGuide}
  style={{
    position: 'fixed', bottom: 80, right: 16, zIndex: 100,
    width: 36, height: 36, borderRadius: '50%',
    background: '#034065', color: '#fff',
    border: 'none', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}
>
  ?
</button>

      <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1000, margin: '0 auto', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>

        {/* HEADER BLEU */}
        <div style={{ background: '#034065', borderRadius: 12, padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
            De zéro à investisseur : Le guide complet
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
            23 fiches pour comprendre, agir et ne pas se faire piéger
          </div>
          {chapitresValides.size > 0 && (
            <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              {chapitresValides.size} / 5 chapitres validés
            </div>
          )}
        </div>


        {/* CHAPITRES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CHAPITRES.map((ch) => {
            const valide = chapitresValides.has(ch.badgeSlug)
            return (
              <div key={ch.num} style={{ background: t.bgCard, border: `0.5px solid ${valide ? ch.couleur : t.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '18px 20px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: ch.couleur + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: ch.couleur, flexShrink: 0 }}>
                      {ch.num}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>{ch.titre}</div>
                    </div>
                    {valide && (
                      <div style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: ch.couleur + '15', color: ch.couleur, fontWeight: 500, border: `0.5px solid ${ch.couleur}40` }}>
                        ✓ Validé
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.5 }}>{ch.resume}</div>
                </div>
                <div style={{ borderTop: `0.5px solid ${t.border}` }}>
                  {ch.fiches.map((fiche, idx) => (
                    <div
                      key={fiche.id}
                      onClick={() => ouvrirFiche(fiche, ch)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: idx < ch.fiches.length - 1 ? `0.5px solid ${t.border}` : 'none', cursor: 'pointer', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = t.bgSecondary}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 10, fontWeight: 500, color: ch.couleur, minWidth: 22 }}>{String(fiche.id).padStart(2, '0')}</span>
                      <span style={{ fontSize: 13, color: t.text, flex: 1 }}>{fiche.titre}</span>
                      {fiche.derniereFiche && !valide && (
                        <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: ch.couleur + '15', color: ch.couleur, fontWeight: 500 }}>Badge</span>
                      )}
                      <span style={{ fontSize: 11, color: ch.couleur }}>→</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>

      <FooterApp />
    </div>
  )
}
