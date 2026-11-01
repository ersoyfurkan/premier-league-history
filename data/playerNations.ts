// Nationality of players that only appear in the career data. Only nations used as Tik Tak Toe clues are listed.
const GROUPS: Record<string, string> = {
  eng: "Dele Alli|Kalvin Phillips|Jadon Sancho|Mason Greenwood|Alex Oxlade-Chamberlain|Callum Wilson|Dominic Solanke|Ivan Toney|Danny Welbeck|Marcus Tavernier|Jay Rodriguez|Nick Pope|Eberechi Eze|Marc Guéhi|Eddie Nketiah|Andros Townsend|Morgan Gibbs-White|Callum Hudson-Odoi|Elliot Anderson|Stan Collymore|Jobe Bellingham|Jude Bellingham|Kevin Phillips|Emile Smith Rowe|Conor Gallagher|Tammy Abraham|Chris Smalling|Joe Hart|Gareth Southgate|Trevor Francis|Kevin Keegan|Steve McManaman|Jonathan Woodgate|Gary Lineker|Ruben Loftus-Cheek|Fikayo Tomori|Mason Mount|Ben White|Anthony Gordon|Jacob Murphy|Jacob Ramsey|Morgan Rogers|Kobbie Mainoo|Trevoh Chalobah|Liam Delap|Dean Henderson|Curtis Jones|Joe Gomez|Jarell Quansah|Adam Wharton|Fabian Delph|Noni Madueke|Jamie Gittens|Lloyd Kelly|Keinan Davis|Max Kilman",
  wal: "Daniel James|Ethan Ampadu|Aaron Ramsey|Brennan Johnson|Ashley Williams|Mark Hughes|Ian Rush|John Charles",
  fra: "Alexandre Lacazette|Michael Olise|Wesley Fofana|Randal Kolo Muani|Pierre Kalulu|Moussa Diaby|Mathieu Flamini|Louis Saha|David Ginola|Neal Maupay|Wilson Odobert|Mamadou Sakho|Matteo Guendouzi|Adrien Rabiot|Boubacar Kamara|Eduardo Camavinga|Grégoire Defrel|Samuel Umtiti|Clément Lenglet|Mathieu Debuchy|Francis Coquelin|Geoffrey Kondogbia|Corentin Tolisso|Youssouf Fofana|Dayot Upamecano|Christopher Nkunku|Mohamed Simakan|Castello Lukeba|Enzo Millot|Khéphren Thuram|Marcus Thuram|Kurt Zouma|Tiémoué Bakayoko|Axel Disasi|Malo Gusto|Aurélien Tchouaméni|Leny Yoro|Jean-Philippe Mateta|Maxence Lacroix|Hugo Ekitike|Lucas Chevalier|Bradley Barcola|Rayan Cherki|Yann M'Vila|Rémy Cabella|Maxence Caqueret|Jonathan Clauss|Florian Sotoca|Lucas Da Cunha|Enzo Le Fée|Sacha Boey|Jean Butez|Yannick Cahuzac|Ange-Yoan Bonny|Mathys Tel|Mehdi Benatia",
  esp: "Álvaro Negredo|Nacho Monreal|Dani Ceballos|Marco Asensio|Lucas Vázquez|Robin Le Normand|Suso|Alberto Moreno|Borja Mayoral|Aleix García|Raúl de Tomás|Joselu|Lucas Pérez|Dean Huijsen|Angeliño|Sergi Roberto|Juan Miranda|Pablo Sarabia|Iago Aspas|Santi Mina|Brais Méndez|Alfonso Pedraza|Ayoze Pérez|Pau Torres|Samu Castillejo|Hugo Duro|Rafa Mir|Marc Bartra|Gerard Deulofeu|Munir El Haddadi|Denis Suárez|Jon Moncayola|Dani Rodríguez|Yeremi Pino|Álex Berenguer|Dani Olmo|Jesús Gámez|Dani Parejo|Marc Roca|Rodri Hernández|Luis García|Fernando Morientes|Albert Riera|David de Gea|Mario Hermoso|Fran García|Brahim Díaz|Nico Williams|Martín Zubimendi|Álvaro Carreras|Joan García|Marc Cucurella|Robert Sánchez|Pablo Maffeo|Jesús Rodríguez|Pau Cubarsí",
  bra: "Antony|Arthur|Arthur Melo|Hulk|Gleison Bremer|Dida|Alexandre Pato|Hernanes|Joao Pedro|Matheus Cunha|Savinho|Evanilson|Galeno|Alex Sandro|Anderson|Fred|Felipe Melo|Gabriel Sara|Alex Teixeira|Taison|Bernard|Dentinho|Luiz Adriano|Eguinaldo|Marlon Gomes|Ismaily|Neymar Jr|Gabriel Magalhaes|Gabriel Martinelli|Endrick|Estevão|Luis Henrique|Carlos Augusto|Wesley França|Anderson Talisca|Igor Paixão|Rafinha|Alisson Becker|Alisson Santos|David Neres|Lucas Moura|Douglas Luiz|Yan Couto|Andreas Pereira|Paulinho|Danilo|Fernando|Wesley",
  arg: "Enzo Fernández|Alexis Mac Allister|Cristian Romero|Erik Lamela|Alejandro Garnacho|Nahuel Molina|Juan Foyth|Enzo Pérez|Fernando Gago|Giovanni Simeone|Giuliano Simeone|Nicolás González|Franco Mastantuono|Thiago Almada|Maxi Perrone|Máximo Perrone|Joaquín Correa|Nicolás Otamendi|Lisandro López|Marcos Rojo|Facundo Ferreyra|Facundo Medina|Jonathan Calleri|Valentín Castellanos|Leandro Paredes|Lucas Ocampos|Jonathan Silva|Esteban? ",
  uru: "Lucas Torreira|Rodrigo Bentancur|Manuel Ugarte|Darwin Núñez|Matías Vecino|Ronald Araújo|Jonathan Rodríguez|Radamel? ",
  por: "Bernardo Silva|Diogo Jota|João Félix|Joao Felix|Pedro Neto|Rúben Neves|João Moutinho|Joāo Moutinho|Nelson Semedo|Rúben Dias|Diogo Dalot|Nuno Mendes|Matheus Nunes|Pedro Gonçalves|Nelson Oliveira|Danilo Pereira|Maniche|Paulo Ferreira|Raul Meireles|Nani|João Mário|Adrien Silva|Gelson Martins|Geovany Quenda|Gonçalo Inácio|Francisco Trincão|Gonçalo Ramos|João Neves|Gonçalo Guedes|Ricardo Quaresma|Hugo Almeida|Raphaël Guerreiro|Fábio Silva|Ricardo Carvalho|Ruben Amorim|Thierry Correia|Pedro Mendes|Dario Essugo",
  ned: "Daley Blind|Memphis Depay|Donny van de Beek|Georginio Wijnaldum|Cody Gakpo|Xavi Simons|Noa Lang|Brian Brobbey|Donyell Malen|Jeremie Frimpong|Tijjani Reijnders|Luuk de Jong|Steven Bergwijn|Jerdy Schouten|Joey Veerman|Guus Til|Mark van Bommel|Dirk Kuyt|Giovanni van Bronckhorst|Pierre van Hooijdonk|Bruno Martins Indi|Jordy Clasie|Tonny Vilhena|Steven Berghuis|Mats Wieffer|Quinten Timber|Lutsharel Geertruida|Kenneth Vermeer|Jeremain Lens|Luc Castaignos|Ruud Vormer|Wesley Hoedt|Jurrien Timber|Micky van de Ven|Denzel Dumfries|Marten de Roon|Ryan Babel|Ryan Gravenberch|Jayden Oosterwolde|Sam Beukema|Bas Dost|Mick van Buren|Arnaut Danjuma|Jordi Cruyff|Jürgen Locadia",
  bel: "Divock Origi|Amadou Onana|Jérémy Doku|Thomas Meunier|Hans Vanaken|Dennis Praet|Ignace Van der Brempt|Arthur Theate|Brandon Mechele|Simon Mignolet|Lois Openda|Michy Batshuayi|Jan Vertonghen|Charles De Ketelaere|Leandro Trossard|Yannick Carrasco|Romeo Lavia|Johan Bakayoko|Thomas Vermaelen|Christian Benteke|Matz Sels",
  ger: "Ilkay Gündogan|Timo Werner|Sami Khedira|Lukas Podolski|Per Mertesacker|Jens Lehmann|Julian Draxler|Serge Gnabry|Antonio Rüdiger|Marc-Oliver Kempf|Mario Gómez|Jamal Musiala|Karim Adeyemi|Julian Brandt|Maximilian Beier|Felix Nmecha|Niklas Süle|Emre Can|Nico Schlotterbeck|Jonathan Tah|Waldemar Anton|Chris Führich|Deniz Undav|Nick Woltemade|Maximilian Mittelstädt|Jamie Leweling|Marcel Halstenberg|Ridle Baku|David Raum|Johannes Eggestein|Cacau",
  ita: "Mario Balotelli|Jorginho|Moise Kean|Gianfranco Zola|Alberto Aquilani|Federico Bernardeschi|Andrea Cambiaso|Alessandro Buongiorno|Gianluca Mancini|Stephan El Shaarawy|Mattia Zaccagni|Nicolò Rovella|Giacomo Bonaventura|Cristiano Biraghi|Gianluca Scamacca|Mattia Caldara|Davide Zappacosta|Marco Carnesecchi|Leonardo Pavoletti|Sebastiano Esposito|Patrick Cutrone|Sebastiano Luperto|Lorenzo Colombo|Gabriel Strefezza|Giacomo Raspadori|Domenico Berardi|Andrea Pinamonti|Davide Frattesi|Manuel Locatelli|Matteo Politano|Matteo Cancellieri|Riccardo Orsolini|Mattia Destro|Federico Dimarco|Roberto Di Matteo|Nicolò Zaniolo|Riccardo Calafiori|Gianluigi Donnarumma|Leonardo Spinazzola|Francesco Acerbi|Federico Gatti|Lorenzo Pellegrini|Edoardo Goldaniga|Federico Barba|Mattia Mustacchio|Lorenzo Pirola|Fabio Borini|Emerson Palmieri|Lorenzo Lucca|Mateo Retegui|Samuele Ricci",
  sen: "Idrissa Gueye|Kalidou Koulibaly|Édouard Mendy|Ismaïla Sarr|Nicolas Jackson|Abdallah Sima",
  cro: "Domagoj Vida|Josko Gvardiol|Dejan Lovren",
  srb: "Filip Kostic|Mijat Gacinovic|Mile Svilar",
  mex: "Rafael Márquez|Santiago Giménez|Hirving Lozano|Orbelin Pineda|Javier Hernández|Raúl Jiménez",
};

const CP1252: Record<string, number> = {
  "€": 0x80, "‚": 0x82, "ƒ": 0x83, "„": 0x84, "…": 0x85, "†": 0x86, "‡": 0x87, "ˆ": 0x88, "‰": 0x89, "Š": 0x8a, "‹": 0x8b,
  "Œ": 0x8c, "Ž": 0x8e, "‘": 0x91, "’": 0x92, "“": 0x93, "”": 0x94, "•": 0x95, "–": 0x96, "—": 0x97, "˜": 0x98, "™": 0x99,
  "š": 0x9a, "›": 0x9b, "œ": 0x9c, "ž": 0x9e, "Ÿ": 0x9f,
};

// Some names above were saved with broken encoding (e.g. "Ãlvaro", "CubarsÃ­"); repair them so accents match.
function repair(name: string) {
  if (!/[ÃÄ]/.test(name)) return name;
  const bytes = [...name.replace(/Ã(?=[A-Za-z])/g, "A")].map((ch) => (ch.charCodeAt(0) < 256 ? ch.charCodeAt(0) : (CP1252[ch] ?? 63)));
  return Buffer.from(bytes).toString("utf8");
}

const keyOf = (name: string) =>
  repair(name).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();

const MORE: Record<string, string> = {
  esp: "Pedri|Gavi|Lamine Yamal|Pau Cubarsí|Alejandro Balde|Fermín López|Marc Casadó|Eric García|Álex Baena|Pablo Barrios|Koke|Marcos Llorente|Dani Carvajal|Álvaro Carreras|Arda Güler|Oihan Sancet|Mikel Oyarzabal|Mikel Merino|Martin Zubimendi|Pedro Porro|Unai Simón|Aymeric Laporte|Ferran Torres|Álex Remiro|Dani Vivian|Rodri|Fabián Ruiz|Gerard Moreno|Pau López|Jesús Navas|Dani Carvajal",
  fra: "William Saliba|Aurélien Tchouaméni|Jules Koundé|Kylian Mbappé|Ousmane Dembélé|Antoine Griezmann|Désiré Doué|Warren Zaïre-Emery|Théo Hernandez|Mike Maignan|Ibrahima Konaté|Eduardo Camavinga|Ferland Mendy|Dayot Upamecano|Manu Koné|Bradley Barcola",
  arg: "Julián Álvarez|Franco Mastantuono|Rodrigo De Paul|Nicolás González|Thiago Almada|Lautaro Martínez|Exequiel Palacios|Alexis Mac Allister|Emiliano Martínez|Lisandro Martínez|Nico Paz|Giovanni Simeone|Facundo Buonanotte",
  bra: "Raphinha|Vinícius Júnior|Rodrygo|Éder Militão|Gabriel Magalhães|Casemiro|Bruno Guimarães|Alisson|Lucas Paquetá|Richarlison|Marquinhos|Gabriel Jesus|Gabriel Martinelli|Igor Jesus|Joao Pedro",
  por: "Vitinha|João Neves|Nuno Mendes|Rúben Dias|Bruno Fernandes|Diogo Costa|João Cancelo|Rafael Leão|Cristiano Ronaldo|Francisco Conceição|Pedro Neto|João Palhinha",
  uru: "Ronald Araújo|Federico Valverde|José María Giménez|Darwin Núñez|Nahitan Nández|Maximiliano Araújo",
  ned: "Frenkie de Jong|Virgil van Dijk|Nathan Aké|Cody Gakpo|Tijjani Reijnders|Matthijs de Ligt|Memphis Depay|Ryan Gravenberch|Jurriën Timber|Denzel Dumfries|Xavi Simons",
  ger: "Florian Wirtz|Kai Havertz|Joshua Kimmich|Leroy Sané|Antonio Rüdiger|Marc-André ter Stegen|Manuel Neuer|Leon Goretzka|Jonathan Tah|Nico Schlotterbeck|Aleksandar Pavlović",
  eng: "Phil Foden|Declan Rice|Bukayo Saka|Cole Palmer|Harry Kane|Marcus Rashford|Trent Alexander-Arnold|Jude Bellingham|Dean Huijsen|Eberechi Eze|Ollie Watkins|Jordan Pickford|Reece James|John Stones|Harry Maguire|Marc Guéhi|Elliot Anderson|Kyle Walker|Jack Grealish|James Maddison|Jarrod Bowen|Anthony Elanga|Morgan Rogers",
  ita: "Nicolò Barella|Alessandro Bastoni|Federico Chiesa|Sandro Tonali|Gianluigi Donnarumma|Giovanni Di Lorenzo|Alessandro Buongiorno|Nicolo Rovella|Mateo Retegui|Guglielmo Vicario|Riccardo Calafiori",
  sen: "Pape Matar Sarr|Sadio Mané|Nicolas Jackson|Pape Gueye|Ismaila Sarr",
  bel: "Kevin De Bruyne|Romelu Lukaku|Jérémy Doku|Thibaut Courtois|Leandro Trossard|Youri Tielemans|Lois Openda",
  cro: "Josko Gvardiol|Luka Modrić|Mateo Kovačić|Ivan Perišić|Marcelo Brozović|Ivan Rakitić|Andrej Kramarić",
  mex: "Santiago Giménez|Edson Álvarez|Raúl Jiménez|Johan Vásquez",
};

const NATION_MAP: Map<string, string> = new Map(
  [...Object.entries(GROUPS), ...Object.entries(MORE)].flatMap(([nat, names]) =>
    names
      .split("|")
      .map((name) => name.trim())
      .filter((name) => name && !name.endsWith("?"))
      .map((name) => [keyOf(name), nat] as [string, string]),
  ),
);

export const nationOf = (name: string): string | undefined => NATION_MAP.get(keyOf(name));
