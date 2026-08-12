
export const TermsOfUse = () => {
  return (
    <main className="">
      <header className="mb-6 flex flex-col gap-2">
        <h1 className="text-4xl font-semibold">Conditions d'utilisation</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Dernière mise à jour : 24 octobre 2025
        </p>
      </header>

      <section className="mt-6 text-gray-700 dark:text-gray-200 space-y-4">
        <p>
          Bienvenue sur MboaPro. Ces Conditions d'utilisation ("Conditions")
          régissent votre accès et votre utilisation de l'interface
          d'authentification fournie par ce projet. En utilisant ce service,
          vous acceptez ces Conditions.
        </p>

        <h2 className="text-lg font-medium mt-4">1. Acceptation</h2>
        <p>
          En accédant ou en utilisant notre interface, vous confirmez que vous
          acceptez ces Conditions et toutes lois applicables. Si vous n'acceptez
          pas ces Conditions, n'utilisez pas le service.
        </p>

        <h2 className="text-lg font-medium mt-4">2. Utilisation autorisée</h2>
        <p>
          L'interface est fournie pour faciliter l'authentification des
          utilisateurs. Vous vous engagez à ne pas utiliser le service pour des
          activités illégales, nuisibles ou non autorisées.
        </p>

        <h2 className="text-lg font-medium mt-4">
          3. Données et confidentialité
        </h2>
        <p>
          Ce dépôt contient uniquement l'interface front-end. La gestion des
          données utilisateur (stockage, traitement, logs) dépend de l'API côté
          serveur connectée. Consultez la politique de confidentialité du
          service back-end pour les pratiques de traitement des données.
        </p>

        <h2 className="text-lg font-medium mt-4">
          4. Propriété intellectuelle
        </h2>
        <p>
          Le code, les illustrations et le design du projet sont la propriété de
          leurs auteurs respectifs. Toute réutilisation doit respecter la
          licence choisie pour ce dépôt.
        </p>

        <h2 className="text-lg font-medium mt-4">
          5. Limitation de responsabilité
        </h2>
        <p>
          Le projet est fourni "tel quel" sans garantie. Les auteurs déclinent
          toute responsabilité en cas de dommages directs ou indirects résultant
          de l'utilisation du logiciel.
        </p>

        <h2 className="text-lg font-medium mt-4">
          6. Modifications des conditions
        </h2>
        <p>
          Nous nous réservons le droit de modifier ces Conditions. Les
          changements seront effectifs dès leur publication : continuez à
          consulter cette page pour prendre connaissance des mises à jour.
        </p>

        <h2 className="text-lg font-medium mt-4">7. Contact</h2>
        <p>
          Pour toute question relative à ces Conditions ou au projet, contactez
          :
          <br />
          <a
            href="mailto:support@mboapro.com"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            support@mboapro.com
          </a>
        </p>
      </section>

      <footer className="mt-8 text-sm text-surface/50">
        En utilisant cette interface, vous reconnaissez avoir lu et compris ces
        Conditions.
      </footer>
    </main>
  );
};

export const Privacy = () => {
  return (
    <main className="">
      <header className="mb-6 flex flex-col gap-2">
        <h1 className="text-4xl font-semibold">Politique de confidentialité</h1>
        <i className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Dernière mise à jour : 24 octobre 2025
        </i>
      </header>

      <section className="mt-6 text-gray-700 dark:text-gray-200 space-y-4">
        <p>
          MboaPro prend la confidentialité au sérieux. Cette politique explique
          quelles données peuvent être collectées par l'interface front-end,
          comment elles sont utilisées et quels droits vous possédez.
        </p>

        <h2 className="text-lg font-medium mt-4">
          1. Responsable du traitement
        </h2>
        <p>
          Cette interface front-end fonctionne comme client pour une API
          back-end. Le responsable du traitement des données utilisateur est
          l'entité qui opère l'API / le service auquel vous vous connectez.
          Vérifiez la politique de confidentialité du service back-end pour les
          détails de traitement.
        </p>

        <h2 className="text-lg font-medium mt-4">2. Données collectées</h2>
        <p>
          L'interface peut collecter ou transmettre les types de données
          suivants :
        </p>
        <ul className="list-disc ml-6">
          <li>
            Identifiants fournis par l'utilisateur (email, mot de passe lors de
            la saisie).
          </li>
          <li>
            Paramètres de session (tokens d'authentification envoyés au
            back-end).
          </li>
          <li>
            Informations techniques (adresse IP, user-agent) si le back-end les
            enregistre.
          </li>
          <li>Données de diagnostic et de logs pour améliorer le service.</li>
        </ul>

        <h2 className="text-lg font-medium mt-4">3. Finalités</h2>
        <p>
          Les données sont utilisées pour : authentifier les utilisateurs,
          maintenir la session, sécuriser l'accès, fournir des messages
          d'erreur/contextuels et améliorer l'expérience utilisateur.
        </p>

        <h2 className="text-lg font-medium mt-4">
          4. Cookies et technologies similaires
        </h2>
        <p>
          L'interface peut utiliser des cookies ou le stockage local pour
          conserver des préférences d'interface ou des tokens. Le comportement
          exact dépend de la configuration du back-end et du navigateur.
        </p>

        <h2 className="text-lg font-medium mt-4">5. Partage et divulgation</h2>
        <p>
          L'interface front-end n'envoie des données qu'au back-end configuré.
          Aucun partage tiers n'est effectué par défaut depuis ce dépôt. Toute
          transmission à des services tiers doit être documentée par le
          responsable du back-end.
        </p>

        <h2 className="text-lg font-medium mt-4">6. Sécurité</h2>
        <p>
          Des pratiques de sécurité standard (HTTPS, tokens, en-têtes) doivent
          être utilisées pour protéger les données en transit. Ce dépôt fournit
          uniquement l'interface : la sécurité finale dépend de la mise en œuvre
          back-end et du déploiement.
        </p>

        <h2 className="text-lg font-medium mt-4">
          7. Conservation des données
        </h2>
        <p>
          La durée de conservation des données est déterminée par le back-end.
          L'interface ne conserve pas les données utilisateur côté serveur.
        </p>

        <h2 className="text-lg font-medium mt-4">8. Vos droits</h2>
        <p>
          Selon votre juridiction et la configuration du service, vous pouvez
          avoir le droit d'accès, de rectification, d'effacement, de limitation
          ou de portabilité des données. Contactez le responsable du back-end
          pour exercer ces droits.
        </p>

        <h2 className="text-lg font-medium mt-4">
          9. Modifications de cette politique
        </h2>
        <p>
          Nous pouvons mettre à jour cette politique. Les modifications seront
          publiées ici avec une nouvelle date de mise à jour.
        </p>

        <h2 className="text-lg font-medium mt-4">10. Contact</h2>
        <p>
          Pour toute question relative à cette politique de confidentialité,
          contactez :
          <br />
          <a
            href="mailto:privacy@mboapro.com"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            privacy@mboapro.com
          </a>
        </p>
      </section>

      <footer className="mt-8 text-sm text-foreground/50">
        Cette politique concerne l'interface front-end MboaPro. Pour des
        informations complètes sur le traitement des données, consultez la
        documentation du back-end.
      </footer>
    </main>
  );
};

export const Help = () => {
  return (
    <main className="">
      <header className="mb-6 flex flex-col gap-2">
        <h1 className="text-4xl font-semibold">Aide & Support</h1>
        <i className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Besoin d'aide ? Trouvez des réponses rapides ou contactez l'équipe.
        </i>
      </header>

      <section className="mt-6 text-gray-700 dark:text-gray-200 space-y-6">
        <div>
          <h2 className="text-lg font-medium">Guide rapide</h2>
          <p className="mt-2">
            - Se connecter : utilisez la page de connexion et saisissez votre
            email et mot de passe.
            <br />
            - Inscription : rendez-vous sur la page d'inscription pour créer un
            compte.
            <br />- Réinitialisation : la fonctionnalité "mot de passe oublié"
            envoie un email via le back-end configuré.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium">FAQ</h2>
          <ul className="mt-2 list-disc ml-6 space-y-2">
            <li>
              Q : Je ne reçois pas l'email de réinitialisation.
              <br />R : Vérifiez le dossier spam et la configuration du back-end
              (SMTP/service d'email).
            </li>
            <li>
              Q : Comment activer le mode sombre ?
              <br />R : Le thème sombre suit la classe <code>dark</code> sur
              l'élément racine ; vérifiez la préférence du navigateur ou du
              système.
            </li>
            <li>
              Q : Où sont stockés mes données ?
              <br />R : L'interface front-end n'héberge pas les données ; le
              stockage est assuré par l'API back-end que vous configurez.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-medium">Ressources</h2>
          <ul className="mt-2 list-disc ml-6">
            <li>
              Guide du développeur : consultez{" "}
              <a
                href="/README.md"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                README
              </a>{" "}
              du projet.
            </li>
            <li>
              Composants UI : dossier <code>src/components/ui</code>.
            </li>
            <li>
              Internationalisation : <code>src/core/Localization</code>.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-medium">Contact</h2>
          <p className="mt-2">
            Pour toute question technique ou signalement de bug, écrivez à :
            <br />
            <a
              href="mailto:support@mboapro.com"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              support@mboapro.com
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium">Contribuer</h2>
          <p className="mt-2">
            Forkez le dépôt, créez une branche feature et ouvrez une PR.
            Respectez les conventions Tailwind/SCSS et ajoutez des tests pour
            les composants critiques.
          </p>
        </div>
      </section>
      <footer className="mt-8 text-sm text-foreground/50">
        Si votre problème est lié au back-end (auth, emails, stockage),contactez
        l'équipe qui gère l'API.
      </footer>
    </main>
  );
};
