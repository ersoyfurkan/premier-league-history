// Player careers for Club Duel. Format "Name:club keys". These are merged with the Tik Tak Toe facts.
import { SQUADS } from "@/data/clubDuelSquads";
import { BUNDESLIGA_CAREERS } from "@/data/bundesligaContent";
import { LIGUE1_CAREERS } from "@/data/ligue1Content";
import { SUPERLIG_CAREERS } from "@/data/superligContent";
// Keys: ars avl bou bre bha bur che cry eve fulham lee liv mci mun new nfo sun tot wham wol (PL)
// alv ath atm bar cel elc esp get gir lvt mll osa ovi ray bet rma soc sev val vil (La Liga)
// ata bol cag com cre fio gen ver inter juv laz lec mil nap par pis sas tor udi rom (Serie A)
// bay dor psg ajax lev ben spo mon mar psv (other Champions League clubs)
// por bru fey lil bod rbl fen sha gal sla slo stu aek lask lens vik sab (2026-27 Champions League newcomers)
const BASE_CAREERS = `
Radamel Falcao:atm mon mun che ray
Gareth Bale:tot rma
Daley Blind:ajax mun gir
Memphis Depay:psv mun bar atm
Ángel Di María:rma mun psg juv ben
Álvaro Morata:rma juv che atm mil
Romelu Lukaku:che eve mun inter rom nap
Diego Costa:atm che
Cesc Fàbregas:ars bar che mon com
Thibaut Courtois:che atm rma
Eden Hazard:che rma
Kepa Arrizabalaga:ath che rma ars
Juan Mata:che mun val
Nemanja Matić:che mun ben
David Luiz:che ars ben
Willian:che ars
Pedro:bar che rom laz
Samuel Eto'o:mll bar inter che eve
Kevin De Bruyne:che mci nap
Mohamed Salah:che liv rom fio
Mesut Özil:rma ars
Alexis Sánchez:bar ars mun inter udi
Henrikh Mkhitaryan:ars rom inter dor mun
Pierre-Emerick Aubameyang:ars bar dor che mil
Olivier Giroud:ars che mil
Gonzalo Higuaín:rma nap juv mil che
Fernando Torres:atm liv che mil
Luis Suárez:liv bar atm ajax
Philippe Coutinho:liv bar bay avl inter
Raheem Sterling:liv mci che ars
Jadon Sancho:mun dor che
Erling Haaland:dor mci
Harry Kane:tot bay
Son Heung-min:tot lev
Christian Eriksen:ajax tot inter mun bre
Dele Alli:tot mun eve
Kyle Walker:tot mci
Luka Modrić:tot rma
Rafael van der Vaart:ajax rma tot
Ivan Perišić:inter tot dor
Rodri:atm mci vil
Aymeric Laporte:ath mci
João Cancelo:val inter juv mci bay bar ben
Bernardo Silva:mon mci ben
Ederson:ben mci
Sergio Agüero:atm mci bar
Carlos Tevez:mun mci juv wham
Edin Džeko:mci rom inter
Mario Balotelli:inter mci mil liv
Álvaro Negredo:sev mci val
Jack Grealish:avl mci
Kalvin Phillips:lee mci
Ilkay Gündoğan:dor mci bar
Leroy Sané:mci bay
Riyad Mahrez:lei mci
Harry Maguire:lei mun
James Maddison:lei tot
Youri Tielemans:mon lei avl
Wesley Fofana:mon lei che
Ben Chilwell:lei che
Jorginho:ver nap che ars
Marcus Rashford:mun avl bar
Jude Bellingham:dor rma
Casemiro:rma mun
Raphaël Varane:rma mun com
Antony:ajax mun bet
Cristiano Ronaldo:mun rma juv
Paul Pogba:mun juv mon
Zlatan Ibrahimović:ajax juv inter bar mil psg mun
Edinson Cavani:nap psg mun val
Bruno Fernandes:udi sam spo mun
Rasmus Højlund:ata mun nap
Scott McTominay:mun nap
Victor Lindelöf:ben mun
Mason Greenwood:mun get mar
Donny van de Beek:ajax mun eve
André Onana:ajax inter mun
Moise Kean:juv eve fio
Idrissa Gueye:avl eve psg
Jordan Pickford:sun eve
Amadou Onana:eve avl
Gylfi Sigurdsson:tot eve
Lucas Digne:bar rom psg avl eve
Yerry Mina:bar eve cag
André Gomes:val bar eve
Theo Walcott:ars eve
Alex Oxlade-Chamberlain:ars liv
Santi Cazorla:vil ars mal ovi
Nacho Monreal:osa mal ars soc
Héctor Bellerín:ars bet bar
Mikel Arteta:ars eve soc
Mathieu Flamini:ars mil
Thomas Vermaelen:ars bar
Aaron Ramsey:ars juv
Dani Ceballos:bet rma ars
Martin Ødegaard:rma soc ars
Thomas Partey:atm ars
Alexandre Lacazette:ars
Gabriel Jesus:mci ars
Oleksandr Zinchenko:mci ars
Declan Rice:wham ars
Kai Havertz:lev che ars
Mikel Merino:osa soc ars
Alexander Isak:soc new liv
Bruno Guimarães:new
Sandro Tonali:mil new
Kieran Trippier:tot atm new
Callum Wilson:bou new wham
Michael Owen:liv rma new mun
Alan Shearer:new
Andy Carroll:new liv wham
Yohan Cabaye:new psg
Demba Ba:wham che new
Dimitri Payet:mar wham
Lucas Paquetá:mil wham
Mohammed Kudus:ajax wham tot
Javier Hernández:mun rma lev wham
Sébastien Haller:wham ajax dor
Felipe Anderson:laz wham
Pablo Zabaleta:esp mci wham
Gianfranco Zola:par nap che wham cag
Paolo Di Canio:laz juv nap mil wham
Emmanuel Adebayor:ars mci rma tot
Robbie Keane:inter lee tot liv wham wol
Jermain Defoe:wham tot sun bou
Darren Bent:avl tot sun fulham
Dimitar Berbatov:lev tot mun fulham
David Ginola:new tot avl
Lucas Moura:psg tot
Dejan Kulusevski:ata par juv tot
Rodrigo Bentancur:juv tot
Richarlison:eve tot
Cristian Romero:ata juv tot gen
Yves Bissouma:bha tot
Pedro Porro:spo mci tot
Dominic Solanke:che liv bou tot
Brennan Johnson:nfo tot
Timo Werner:che tot
Xavi Simons:bar psv tot
Sadio Mané:liv bay
Virgil van Dijk:liv
Dejan Lovren:liv
Adam Lallana:liv bha
Luis García:bar liv atm
Xabi Alonso:soc liv rma bay
Javier Mascherano:liv bar
Pepe Reina:bar liv nap mil vil
Fernando Morientes:rma liv mon val
Álvaro Arbeloa:liv rma
Albert Riera:esp liv
Alberto Aquilani:rom liv juv mil fio
Divock Origi:liv mil wol
Georginio Wijnaldum:psv new liv psg
Luis Díaz:liv bay
Cody Gakpo:psv liv
Alisson Becker:rom liv
Diogo Jota:wol liv atm
Darwin Núñez:ben liv
Florian Wirtz:lev liv
Hugo Ekitiké:liv
Alexis Mac Allister:bha liv
Federico Chiesa:fio juv liv
Jérémie Frimpong:lev liv
Milos Kerkez:bou liv
Giorgi Mamardashvili:val liv
Cole Palmer:mci che
Enzo Fernández:ben che
Moisés Caicedo:bha che
Nicolas Jackson:vil che bay
João Félix:ben atm che mil bar
Noni Madueke:psv che ars
Pedro Neto:wol che
Marc Cucurella:bar get bha che
Jamie Gittens:dor che
João Pedro:bha che
Alejandro Garnacho:mun che
Robert Sánchez:bha che
Marcos Alonso:fio che bar
César Azpilicueta:mar che atm
Thiago Silva:mil psg che
Petr Čech:che ars
Ashley Cole:ars che rom
Claude Makélélé:rma che psg
Michael Essien:che rma mil
Ricardo Carvalho:che rma
Arjen Robben:che rma bay
Didier Drogba:che mar
Nicolas Anelka:ars rma psg che
Hernán Crespo:par laz inter che mil
Adrian Mutu:par juv che fio inter
Gianluca Vialli:sam juv che
Roberto Di Matteo:laz che
Frank Lampard:wham che mci
Juan Cuadrado:fio che juv inter
Mateo Kovačić:inter rma che mci
Ivan Toney:bre
Yoane Wissa:bre new
Bryan Mbeumo:bre mun
Pascal Groß:bha dor bre
Danny Welbeck:mun ars bha
Leandro Trossard:bha ars
Neal Maupay:bre bha
Antoine Semenyo:bou mci
Marcus Tavernier:bou new
Nathan Aké:che bou mci
Ryan Fraser:bou new
Joshua King:mun bou
Chris Wood:bur new nfo
Jay Rodriguez:bur
Nick Pope:bur new
Maxwel Cornet:bur wham
Wilson Odobert:bur tot
Jacob Bruun Larsen:dor bur
Wilfried Zaha:cry mun
Michael Olise:cry bay
Eberechi Eze:cry ars
Marc Guéhi:che cry
Ismaïla Sarr:cry mar
Eddie Nketiah:ars cry
Andros Townsend:tot new cry eve
Yannick Bolasie:cry eve
Christian Benteke:avl liv cry
Mamadou Sakho:psg liv cry wham
Morgan Gibbs-White:nfo wol
Taiwo Awoniyi:liv nfo
Callum Hudson-Odoi:che nfo
Anthony Elanga:mun nfo new
Elliot Anderson:new nfo
Matz Sels:new nfo
Dan Ndoye:bol nfo
Roy Keane:nfo mun
Stan Collymore:nfo liv avl
Teddy Sheringham:tot mun wham
Granit Xhaka:ars lev sun
Brian Brobbey:ajax sun
Jobe Bellingham:dor sun
Enzo Le Fée:rom sun
Reinildo Mandava:atm sun
Simon Adingra:bha sun
Kevin Phillips:sun avl
Niall Quinn:ars mci sun
Fabio Borini:rom liv sun mil che
Raúl Jiménez:atm ben wol fulham
Rúben Neves:wol
Matheus Cunha:wol mun
João Moutinho:mon wol
Adama Traoré:bar wol
Max Kilman:wol wham
Nélson Semedo:bar wol ben
Rayan Aït-Nouri:wol mci
Rodrigo:val lee
Raphinha:lee bar
Daniel James:mun lee fulham
Dominic Calvert-Lewin:eve lee
Ethan Ampadu:che lee
Noah Okafor:mil nap lee
Mark Viduka:lee
Harry Kewell:lee liv
Rio Ferdinand:wham lee mun
Jimmy Floyd Hasselbaink:lee atm che
Robbie Fowler:lee liv
Eric Cantona:lee mun
Aleksandar Mitrović:fulham
João Palhinha:spo fulham bay
Andreas Pereira:mun fulham
Emile Smith Rowe:ars fulham
Clint Dempsey:fulham tot
Mousa Dembélé:fulham tot
Louis Saha:fulham mun eve tot
Emiliano Martínez:ars avl
Ollie Watkins:bre avl
Leon Bailey:lev avl
Moussa Diaby:lev avl
Donyell Malen:dor avl
Matty Cash:nfo avl
Boubacar Kamara:mar avl
Ezri Konsa:bre avl
Douglas Luiz:avl juv
Ashley Young:avl mun inter eve
Gareth Barry:avl mci eve
James Milner:lee new avl mci liv bre bha
Stewart Downing:avl liv
Ciro Immobile:juv gen tor dor sev laz
Vinícius Júnior:rma
Neymar:bar psg
Ousmane Dembélé:dor bar psg
Antoine Griezmann:soc atm bar
Thiago Alcântara:bar bay liv
Ivan Rakitić:sev bar
Jordi Alba:val bar
Dani Alves:sev bar juv psg
Ronaldinho:psg bar mil
Thierry Henry:mon juv ars bar
Javier Saviola:bar rma ben sev mal
Robert Lewandowski:dor bay bar
Ferran Torres:val mci bar
Éder Militão:rma
Eduardo Camavinga:rma
Toni Kroos:bay rma lev
Kylian Mbappé:mon psg rma
James Rodríguez:mon rma bay
Karim Benzema:rma
Luka Jović:rma fio mil
Sergio Ramos:rma sev psg
Isco:mal rma bet
Marco Asensio:mll esp rma psg fio
Achraf Hakimi:rma dor inter psg
Dani Carvajal:lev rma
Lucas Vázquez:esp rma
Diego Forlán:mun vil atm inter
Diego Godín:atm inter
Jan Oblak:ben atm
Alexander Sørloth:vil soc atm
Julián Álvarez:mci atm
Conor Gallagher:che cry atm
Robin Le Normand:soc atm
Marcos Llorente:rma atm
Rodrigo De Paul:udi val atm
Nahuel Molina:udi atm
Carlos Bacca:mil sev vil
Gerard Moreno:esp vil
Giovani Lo Celso:psg bet vil tot
Nabil Fekir:bet
Joaquín:bet val mal fio
Éver Banega:val sev inter
Jesús Navas:sev mci
Luis Alberto:laz sev
Youssef En-Nesyri:mal sev
Papu Gómez:ata sev
Erik Lamela:rom tot sev
Suso:mil sev
Jules Koundé:sev bar
Diego Carlos:sev avl
Alberto Moreno:sev liv vil
Takefusa Kubo:mll vil get soc rma
David Silva:val mci soc
Carlos Vela:ars soc
Aritz Aduriz:ath val
Fernando Llorente:ath juv nap tot sev
Ander Herrera:ath mun psg
Javi Martínez:ath bay
Raúl García:osa atm ath
Borja Mayoral:rma get rom
Aleix García:gir lev
Savinho:gir mci
Artem Dovbyk:gir rom
Valentín Castellanos:gir laz
Pablo Maffeo:mci gir mll
Raúl de Tomás:rma ray esp
Joselu:new esp rma alv
Lucas Pérez:dep ars wham alv
Vedat Muriqi:laz mll
Paulo Dybala:pal juv rom
Mauro Icardi:sam inter psg
Nicolò Barella:cag inter
Alessandro Bastoni:ata par inter
Hakan Çalhanoğlu:lev mil inter
Joaquín Correa:sam laz inter sev
Mario Mandžukić:bay atm juv mil
Sami Khedira:rma juv
Miralem Pjanić:rom juv bar
Leonardo Bonucci:inter pis juv mil
Dušan Vlahović:fio juv
Federico Bernardeschi:fio juv bol
Douglas Costa:bay juv
Arthur:bar juv liv fio
Weston McKennie:juv lee
Adrien Rabiot:psg juv mar
Gleison Bremer:tor juv
Danilo:mci juv
Andrea Cambiaso:gen bol juv
Teun Koopmeiners:ata juv
Randal Kolo Muani:psg juv tot
Lloyd Kelly:new juv bou
Pierre Kalulu:mil juv
Kvicha Kvaratskhelia:nap psg
Victor Osimhen:nap
Kalidou Koulibaly:nap che
Dries Mertens:psv nap
Fabián Ruiz:nap psg bet
Amir Rrahmani:ver nap
Alessandro Buongiorno:tor nap
Noa Lang:psv nap
Diego Maradona:nap bar
Ezequiel Lavezzi:nap psg
Mile Svilar:ben rom
Dean Huijsen:juv rom bou rma
Gianluca Mancini:ata rom
Ángeliño:mci rom
Stephan El Shaarawy:gen mil rom
Radja Nainggolan:cag rom inter
Gabriel Batistuta:fio rom inter
Leandro Paredes:rom psg juv
Tammy Abraham:che rom mil
Chris Smalling:mun rom
Sardar Azmoun:lev rom
Gervinho:ars rom par
Pavel Nedvěd:laz juv
Juan Sebastián Verón:sam par laz inter mun che
Diego Simeone:sev atm inter laz
Siniša Mihajlović:sam rom laz inter
Christian Vieri:laz inter juv atm mil
Dejan Stanković:laz inter
Hernanes:laz inter juv
Miroslav Klose:laz bay
Mattia Zaccagni:ver laz
Matteo Guendouzi:mar laz
Nicolò Rovella:gen juv laz
Nikola Milenković:fio nfo
David de Gea:atm mun fio
Robin Gosens:ata inter fio
Giacomo Bonaventura:ata mil fio
Cristiano Biraghi:inter fio
Franck Ribéry:bay fio
Luca Toni:ver fio bay juv rom
Stevan Jovetić:fio mci inter
Mario Gómez:bay fio
Duván Zapata:nap sam ata tor
Ademola Lookman:fulham lei ata
Mario Pašalić:che mil ata
Charles De Ketelaere:mil ata
Gianluca Scamacca:sas wham ata
Josip Iličić:pal fio ata
Luis Muriel:sev fio ata sam udi
Mattia Caldara:ata juv mil
Davide Zappacosta:ata che
Nikola Krstović:lec ata
Marco Carnesecchi:cre ata
Leonardo Pavoletti:nap cag
Sebastiano Esposito:inter cag
Nico Paz:rma com
Assane Diao:bet com
Maxi Perrone:mci com
Andrea Belotti:tor rom fio com
Patrick Cutrone:mil wol fio com
Sergi Roberto:bar com
Jamie Vardy:lei cre
Sebastiano Luperto:nap cre
Patrick Dorgu:lec mun
Lorenzo Colombo:mil lec
Gabriel Strefezza:lec par com
Idrissa Touré:juv pis
Giacomo Raspadori:sas nap atm
Domenico Berardi:sas
Andrea Pinamonti:gen inter sas
Grégoire Defrel:rom sam sas
Davide Frattesi:rom sas inter
Manuel Locatelli:mil sas juv
Jérémie Boga:che sas ata
Pedro Obiang:sam wham sas
Matteo Politano:sas inter nap
Giovanni Simeone:fio gen cag ver nap
Antonín Barák:ver fio
Samir Handanović:udi inter
Lorenzo Lucca:udi nap
Jaka Bijol:udi lee
Lazar Samardžić:udi ata
Beto:udi eve
Keinan Davis:avl udi
Ricardo Rodríguez:wol mil tor
Samuele Ricci:tor mil
Saša Lukić:fulham tor
Valentino Lazaro:new tor inter
Joe Hart:mci tor wham
Che Adams:sou tor
Gianluigi Buffon:par juv psg
Fabio Cannavaro:nap par inter juv rma
Lilian Thuram:mon par juv bar
Matteo Cancellieri:laz par
Adrián Bernabé:mci par
Ange-Yoan Bonny:inter par
Albert Guðmundsson:gen fio
Mattia Perin:gen juv
Domenico Criscito:gen juv
Mateo Retegui:gen ata
Ruslan Malinovskyi:ata gen mar
Leo Østigård:bha gen nap
Joshua Zirkzee:bay bol mun
Remo Freuler:ata nfo bol
Riccardo Orsolini:juv bol
Roberto Baggio:fio juv mil bol inter
Giuseppe Signori:laz bol
Gary Medel:inter bol
Rodrigo Palacio:gen inter bol
Mattia Destro:gen rom mil bol
Juan Miranda:bar bol
Musa Barrow:ata bol
Marcus Thuram:inter
Lautaro Martínez:inter
Federico Dimarco:inter
Joaquín Correa:sev
Rafael Márquez:bar
Michael Laudrup:juv bar rma
Hristo Stoichkov:bar par
Luis Figo:bar rma inter
Roberto Carlos:inter rma
Ronaldo:inter bar rma mil
Zinedine Zidane:juv rma
Clarence Seedorf:ajax sam rma inter mil
Patrick Kluivert:ajax mil bar new val
Edgar Davids:ajax mil juv inter tot
Marc Overmars:ajax ars bar
Dennis Bergkamp:ajax inter ars
Ruud van Nistelrooy:psv mun rma
Jaap Stam:psv mun laz mil
Andrés Iniesta:bar
Xavi:bar
Gerard Piqué:mun bar
Nolito:cel gir mci sev
Pablo Sarabia:sev psg wol
Iago Aspas:cel liv
Santi Mina:cel val
Pione Sisto:cel
Brais Méndez:cel soc
Alfonso Pedraza:vil
Ayoze Pérez:new lei bet vil
Arnaut Danjuma:bou vil eve tot
Juan Foyth:tot vil
Dani Parejo:val vil
Pau Torres:vil avl
Nicolas Pépé:ars vil
Thierry Correia:val vil
Raúl Albiol:rma nap vil val
Ángel Correa:atm
Antoine Griezmann:bar
Memphis Depay:lyon
Yannick Carrasco:atm
Stefan Savić:atm
Rodrygo:rma
Gareth Southgate:cry avl
Ashley Williams:swa
Ricardo Quaresma:bar inter por
Hugo Almeida:por
Jonathan Calleri:ath
Samu Castillejo:val mil
Lucas Ocampos:mar mil sev
Munir El Haddadi:bar sev
Enzo Pérez:val
Geoffrey Kondogbia:inter val mar
Denis Cheryshev:rma val vil
Francis Coquelin:ars val vil
Gonçalo Guedes:val wol ben
Hugo Duro:val
Mouctar Diakhaby:val
Yunus Musah:val mil
Rafa Mir:val sev
Roberto Soldado:val vil tot
Pablo Hernández:val
Alessandro Del Piero:juv
Francesco Totti:rom
Paolo Maldini:mil
Franco Baresi:mil
Javier Zanetti:inter
Andrea Pirlo:inter mil juv
Gennaro Gattuso:mil
Kaká:mil rma
Andriy Shevchenko:mil che
Alexandre Pato:mil che
Robinho:rma mci mil
Dida:mil
Cafu:rom mil
Jaap Stam:mil
Ruud Gullit:mil sam
Marco van Basten:ajax mil
Frank Rijkaard:ajax mil
Mark Hughes:mun bar che
Gary Lineker:eve bar tot
Ian Rush:liv juv
John Charles:juv rom
Graeme Souness:liv sam
Liam Brady:juv inter
Trevor Francis:sam
Kevin Keegan:liv
Steve McManaman:liv rma mci
Michael Owen:liv
Jonathan Woodgate:new rma
David Beckham:mun rma mil psg
Jesé:rma psg
Willian José:soc
Wesley Sneijder:ajax rma inter
Robin van Persie:ars mun
Samir Nasri:ars mci mar
Gaël Clichy:ars mci
Bacary Sagna:ars mci
Kolo Touré:ars mci liv
Emmanuel Eboué:ars
Tomas Rosický:dor ars
Jens Lehmann:dor ars
Lukas Podolski:ars bay
Mathieu Debuchy:ars
Per Mertesacker:ars
Marouane Chamakh:ars
Yaya Touré:bar mci
Samuel Umtiti:lyon bar
Clément Lenglet:bar tot atm
Arthur Melo:bar
Martin Braithwaite:bar esp
Ivan... Marc Bartra:bar bet
Sergi Roberto:bar
Rafinha:bar inter
Gerard Deulofeu:bar mil wat sev eve
Paco Alcácer:bar dor vil val
Munir:val
Denis Suárez:bar vil
Neymar Jr:psg
Lucas Hernández:atm bay psg
Julian Draxler:psg
Sergio Busquets:bar
Marc Cucurella:get
Mikel Oyarzabal:soc
Martin Ødegaard:ars
Jon Moncayola:osa
Luka Modrić:rma
Dani Rodríguez:mll
Samu Chukwueze:vil mil
Ruben Loftus-Cheek:che cry mil
Rafael Leão:mil
Christian Pulisic:dor che mil
Tijjani Reijnders:mil mci
Youssouf Fofana:mon mil
Santiago Giménez:fey mil
Strahinja Pavlović:mil
Fikayo Tomori:che mil
Mike Maignan:mil
Théo Hernandez:atm rma mil
Álex Berenguer:nap tor ath
Yeremi Pino:vil
Sergio Reguilón:rma tot atm
Dani Olmo:bar
Jack Wilshere:ars
Ross Barkley:eve che avl
Kurt Zouma:che wham
Fabian Delph:avl mci eve
Jesús Gámez:mal
Emerson Palmieri:che wham inter mil
Tiémoué Bakayoko:che mil
Fernando Gago:rma
Jonny Evans:mun lei
Gabriel Magalhães:ars
Rúben Dias:ben mci
Rodri Hernández:mci
Ryan Gravenberch:ajax bay liv
Gabriel Martinelli:ars
Wojciech Szczęsny:ars rom juv bar
Mehdi Benatia:udi rom bay juv
Kingsley Coman:psg juv bay
Corentin Tolisso:bay
Ivan Perišić:wol
Thomas Müller:bay
Radamel Falcao:por atm mon mun che
James Rodríguez:por rma bay
Hulk:por
Ricardo Quaresma:por bar inter che
Pepe:por rma
Fernando:por mci
Danilo Pereira:por psg
Éder Militão:por rma
Alex Sandro:por juv
Yacine Brahimi:por
Moussa Marega:por
Iker Casillas:por rma
Diego Costa:atm che
Jackson Martínez:por atm
Vincent Aboubakar:por bay
Luis Díaz:por liv bay
Mehdi Taremi:por inter
Evanilson:por bou
Galeno:por
Nicolás Otamendi:por val mci ben
Lisandro López:por
Danilo:por rma mci juv
Deco:por bar che
Maniche:por che atm
Ricardo Carvalho:por che rma
Paulo Ferreira:por che
Pedro Mendes:por tot
Anderson:por mun
Raúl Meireles:por liv che
Joāo Moutinho:por mon wol
Rúben Neves:por wol
Diogo Jota:por wol liv atm
Nuno Mendes:spo psg
Pedro Neto:wol che
Matheus Nunes:spo wol mci
Viktor Gyökeres:spo ars bri
Viktor Gyökeres:spo ars cov
Rúben Amorim:spo mun
Bruno Fernandes:spo mun udi
Cristiano Ronaldo:spo mun rma juv
Nani:spo mun val
Ricardo Quaresma:spo
Marcus Rashford:mun bar avl
João Mário:spo inter wham ben
Islam Slimani:spo lei new
Bas Dost:spo
Adrien Silva:spo lei
William Carvalho:spo bet
Gelson Martins:spo atm mon
Rafael Leão:spo lil mil
Geovany Quenda:spo che
Pedro Gonçalves:spo wol
Morten Hjulmand:spo
Manuel Ugarte:spo psg mun
Gonçalo Inácio:spo
Francisco Trincão:spo bar wol
Paulinho:spo bar
Facundo Ferreyra:spo
Jonathan Silva:spo
Marcos Rojo:spo mun
Jeremain Lens:spo
Joel Campbell:spo
Luc Castaignos:spo
Rafael van der Vaart:tot rma ajax
Vincent Kompany:mci
Romelu Lukaku:bru che eve mun inter rom nap
Jan Vertonghen:ajax tot ben
Thibaut Courtois:che atm rma
Eden Hazard:lil che rma
Kevin De Bruyne:che mci
Thomas Meunier:bru psg
Ruud Vormer:bru
Hans Vanaken:bru
Dennis Praet:bru sam
Wesley Hoedt:bru
Ignace Van der Brempt:bru
Charles De Ketelaere:bru mil ata
Jérémy Doku:mci
Leandro Trossard:bru bha ars
Youri Tielemans:avl lei
Aleksandar Mitrović:ful
Arthur Theate:bol
Emmanuel Dennis:bru wat
Wesley:bru avl
Michael Olise:cry bay
Éder Balanta:bru
Brandon Mechele:bru
Ferran Jutglà:bru
Simon Mignolet:liv bru sun
Matías Vecino:inter laz fio
Jonathan Clauss:lens mar
Seko Fofana:lens
Przemysław Frankowski:lens
Florian Sotoca:lens
Facundo Medina:lens mar
Brenden Aaronson:lee
Loïs Openda:lens rbl juv
Wesley Fofana:lei che
Édouard Mendy:che
Ismaël Bennacer:mil
Ibrahim Sangaré:psv nfo
Eran Zahavi:psv
Luuk de Jong:psv bar sev
Memphis Depay:psv mun lyon bar atm
Georginio Wijnaldum:psv liv psg new
Ola Toivonen:psv
Jürgen Locadia:psv bha
Hirving Lozano:psv nap
Steven Bergwijn:psv tot ajax
Cody Gakpo:psv liv
Noni Madueke:psv che ars
Johan Bakayoko:psv
Donyell Malen:psv ars dor avl
Xavi Simons:psv psg rbl bar tot
Jerdy Schouten:psv
Joey Veerman:psv
Ricardo Pepi:psv
Guus Til:psv
Jordi Cruyff:ajax bar mun
Mark van Bommel:psv bar bay mil
Ruud van Nistelrooy:psv mun rma
Park Ji-sung:psv mun
Arjen Robben:psv che rma bay
Dirk Kuyt:fey liv
Robin van Persie:fey ars mun
Giovanni van Bronckhorst:fey ars bar
Jon Dahl Tomasson:fey mil
Pierre van Hooijdonk:fey nfo
Salomon Kalou:fey che
Bruno Martins Indi:fey por
Graziano Pellè:fey sou
Jordy Clasie:fey sou
Tonny Vilhena:fey
Steven Berghuis:fey ajax
Santiago Giménez:fey mil
Luis Sinisterra:fey bou
Orkun Kökçü:fey ben
Mats Wieffer:fey bha
Quinten Timber:fey ars
Igor Paixão:fey mar
Lutsharel Geertruida:fey rbl
Kenneth Vermeer:fey
Georginio:fey
Ayase Ueda:fey
Gernot Trauner:fey lask
Nicolas Anelka:psg ars rma che
Eden Hazard:lil
Nicolas Pépé:lil ars
Victor Osimhen:lil nap gal
Gabriel Magalhães:lil ars
Jonathan David:lil juv
Jonathan Ikoné:lil psg fio
Renato Sanches:lil bay psg rom
Yusuf Yazıcı:lil
Edon Zhegrova:lil
Rémy Cabella:lil
Rudi Garcia:lil
Yann M'Vila:lil
Lucas Digne:lil psg bar rom avl eve
Divock Origi:lil liv mil
Ricardo Quaresma:fen
Djibril Cissé:lil liv mar
Nabil Fekir:lil
Benjamin Pavard:stu bay inter
Serge Gnabry:ars bay
Timo Werner:stu rbl che tot
Sami Khedira:stu rma juv
Mario Gómez:stu bay fio
Antonio Rüdiger:stu rom che rma
Joshua Kimmich:stu rbl bay
Sasa Kalajdzic:stu wol
Konstantinos Mavropanos:stu ars wham
Chris Führich:stu
Serhou Guirassy:stu dor
Deniz Undav:stu bha
Enzo Millot:stu
Waldemar Anton:stu dor
Nick Woltemade:stu new
Ermedin Demirovic:stu
Jamie Leweling:stu
Maximilian Mittelstädt:stu
Pavel Pogrebnyak:stu
Cacau:stu
Vedad Ibisevic:stu
Marc Roca:bay bet
Christopher Nkunku:rbl che psg bay mil
Dani Olmo:rbl bar dor
Dominik Szoboszlai:rbl liv
Dayot Upamecano:rbl bay
Ibrahima Konaté:rbl liv
Naby Keïta:rbl liv
Emil Forsberg:rbl
Yussuf Poulsen:rbl
Willi Orban:rbl
Timo Werner:rbl
Marcel Halstenberg:rbl
Lois Openda:rbl
Benjamin Sesko:rbl mun
Xavi Simons:rbl
Castello Lukeba:rbl lyon
Josko Gvardiol:rbl mci
Amadou Haidara:rbl
Konrad Laimer:rbl bay
Ridle Baku:rbl
Mohamed Simakan:rbl
Eljif Elmas:rbl nap
David Raum:rbl
Yan Diomande:rbl
Rodrygo:rma
Emil Forsberg:rbl
Dani Olmo:dor
Diego Simeone:atm inter laz
Didier Drogba:gal che mar
Wesley Sneijder:gal inter rma ajax
Felipe Melo:gal inter fio juv
Radamel Falcao:gal
Lukas Podolski:gal ars inter bay
Burak Yılmaz:gal lil
Mario Mandzukic:gal juv atm bay mil
Dries Mertens:gal nap
Mauro Icardi:gal inter psg
Hakim Ziyech:gal che ajax
Victor Osimhen:gal
Dries Mertens:gal
Nicolò Zaniolo:gal rom avl ata
Kerem Aktürkoğlu:gal ben
Davinson Sánchez:gal ajax tot
Gabriel Sara:gal
Ryan Babel:gal ajax liv
Wilfried Zaha:gal cry
Michy Batshuayi:gal che fen
Yunus Akgün:gal
Barış Alper Yılmaz:gal
Lucas Torreira:gal ars atm fio
Sacha Boey:gal bay
Roberto Carlos:fen rma inter
Alex de Souza:fen
Dirk Kuyt:fen liv
Robin van Persie:fen
Nicolas Anelka:fen
Mesut Özil:fen ars rma
Edin Dzeko:fen rom inter mci
Dusan Tadic:fen ajax sou
Çağlar Söyüncü:fen atm lei
Anderson Talisca:fen ben
Youssef En-Nesyri:fen sev
Sofyan Amrabat:fen fio mun
Bright Osayi-Samuel:fen
Ferdi Kadioglu:fen bha
Cengiz Ünder:fen rom mar
Jhon Durán:fen avl
Sebastian Szymanski:fen
Fred:fen mun
Nelson Semedo:fen wol
Marco Asensio:fen psg avl rma
Filip Kostic:fen juv
Mario Lemina:fen
Jayden Oosterwolde:fen
Miha Zajc:fen
Kostas Tsimikas:liv
Willian:fen che
Roberto Soldado:fen tot val
Emmanuel Emenike:fen
Mehmet Topal:fen val
Raul Meireles:fen
Alexandre Pato:che
Henrik Larsson:cel bar mun
Andriy Shevchenko:sha mil che
Willian:sha che
Fernandinho:sha mci
Douglas Costa:sha bay juv
Henrikh Mkhitaryan:sha dor mun ars rom inter
Luiz Adriano:sha mil
Alex Teixeira:sha
Taison:sha
Fred:sha mun
Bernard:sha eve
Dentinho:sha
Mykhailo Mudryk:sha che
Oleksandr Zinchenko:mci ars
Anatoliy Tymoshchuk:sha bay
Artem Dovbyk:rom gir
Viktor Tsygankov:gir
Georgiy Sudakov:sha ben
Heorhiy Bushchan:sha
Mykola Matviyenko:sha
Taras Stepanenko:sha
Eguinaldo:sha
Kevin Kampl:sha
Ismaily:sha
Matheus Cunha:wol
Giorgi Chakvetadze:sha
Pedro Henrique:sha
Marlon Gomes:sha
Tomas Soucek:sla wham
Vladimir Coufal:sla wham
Ondrej Kudela:sla
Petr Ševčík:sla
Abdallah Sima:sla bha
Peter Olayinka:sla
Stanislav Tecl:sla
Tomáš Holeš:sla
Jan Kuchta:sla
Lukas Provod:sla
Milan Škoda:sla
David Hovorka:sla
Ivan Schranz:sla
Mick van Buren:sla
Tomás Chory:sla
Vaclav Jurečka:sla
Ibrahim Traoré:sla
Gabriel Magalhaes:sla
Stanislav Lobotka:nap
Jakub Hromada:sla
Alex Král:sla
Milan Škriniar:inter psg
Martin Škrtel:liv
Robert Vittek:sla
Marek Hamsik:nap
Mário Gavranović:sla
Juraj Kucka:mil
Vladimír Weiss:slo
Kyriakos Papadopoulos:aek
Rivaldo:aek bar mil
Nikos Liberopoulos:aek
Konstantinos Katsouranis:aek
Mijat Gacinovic:aek
Razvan Marin:aek cag nap
Levi Garcia:aek
Orbelin Pineda:aek
Domagoj Vida:aek ben
Steven Zuber:aek
Nelson Oliveira:aek
Marko Raguž:lask
Johannes Eggestein:lask
Erling Haaland:bod mci dor
Jens Petter Hauge:bod mil fra
Ulrik Saltnes:bod
Hugo Vetlesen:bod
Morten Thorsby:bod
Joel Mugisha:bod
Philip Zinckernagel:bod
Albert Grønbæk:bod
Patrick Berg:bod
Sondre Brunstad Fet:bod
Isak Hansen-Aarøen:bod
Ole Selnæs:bod
Alexander Sørloth:bod vil atm cry
Martin Ødegaard:ars rma soc
Tore André Flo:vik che
Kristian Thorstvedt:vik tot
Cesc Fàbregas:com ars bar che mon
Nico Paz:com rma
Andrea Belotti:com tor rom fio
Alberto Moreno:com liv vil
Alvaro Morata:com atm rma juv che mil
Jesús Rodríguez:com
Sergi Roberto:com bar
Maxence Caqueret:com
Assane Diao:com bet
Ignace Van der Brempt:com
Mërgim Vojvoda:com tor
Lucas Da Cunha:com
Marc-Oliver Kempf:com stu
Pepe Reina:com liv nap mil bar vil
Dele Alli:com tot eve
Raphael Varane:com mun rma
Jean Butez:com
Anastasios Douvikas:com
Patrick Cutrone:com wol
Gabriel Strefezza:com
Máximo Perrone:com mci
Ya Konan:com
Alieu Fadera:com
Edoardo Goldaniga:com
Yannick Cahuzac:com
Danny Mota:com
Federico Barba:com
Jonathan Rodríguez:com
Mattia Mustacchio:com
Lorenzo Pirola:com
Matthijs de Ligt:ajax juv bay mun
Jadon Sancho:dor mun che avl mci
Marcus Rashford:mun avl bar
Antony:ajax mun bet
Alejandro Garnacho:mun che
Mason Greenwood:mun mar get
Casemiro:rma mun por
Harry Maguire:mun lei
Rasmus Højlund:ata mun nap
Mason Mount:che mun
Jonny Evans:mun lei
Christian Eriksen:tot ajax inter mun bre
Raphaël Varane:rma mun com
Donny van de Beek:ajax mun eve
Anthony Martial:mun sev
Bruno Fernandes:udi spo mun
Matheus Cunha:wol mun atm
Bryan Mbeumo:bre mun
Benjamin Šeško:rbl mun
Patrick Dorgu:mun lec
Diogo Dalot:por mun mil
Leny Yoro:lil mun
Manuel Ugarte:spo psg mun
Joshua Zirkzee:bay bol mun
Noussair Mazraoui:ajax bay mun
Kobbie Mainoo:mun
Ruben Amorim:spo mun
Trent Alexander-Arnold:liv rma
Dean Huijsen:bou rma juv
Álvaro Carreras:ben rma mun
Franco Mastantuono:rma
Florian Wirtz:lev liv
Alexander Isak:soc new liv bor
Hugo Ekitike:psg lens fra liv
Jeremie Frimpong:lev liv cel
Milos Kerkez:bou liv
Viktor Gyökeres:spo ars cov
Eberechi Eze:cry ars
Martín Zubimendi:soc ars
Noni Madueke:psv che ars
Kai Havertz:lev che ars
Declan Rice:wham ars
Leandro Trossard:bha ars
Gabriel Jesus:mci ars
Raheem Sterling:liv mci che ars
Jorginho:ver nap che ars
Thomas Partey:atm ars vil
Ben White:bha ars
Jurrien Timber:ajax ars
Martin Ødegaard:rma ars soc
Riccardo Calafiori:bol ars
Mikel Merino:soc ars osa
Viktor Gyokeres:spo ars
Joan García:esp bar
Marcus Rashford:bar
Robert Lewandowski:dor bay bar
Raphinha:spo lee bar
Ferran Torres:val mci bar
Dani Olmo:rbl dor bar
Frenkie de Jong:ajax bar
Jules Koundé:sev che bar
João Cancelo:mci bay juv mun bar
João Félix:ben atm che bar mil
Wojciech Szczęsny:ars juv rom bar
Ronald Araújo:bar
Ousmane Dembélé:dor bar psg
Gonçalo Ramos:ben psg
Marco Asensio:rma avl psg
Randal Kolo Muani:psg juv tot
Kylian Mbappé:psg rma
Khvicha Kvaratskhelia:nap psg
João Neves:ben psg
Lucas Chevalier:lil psg
Bradley Barcola:lyon psg
Désiré Doué:psg
Achraf Hakimi:rma dor inter psg
Gianluigi Donnarumma:mil psg mci
Tijjani Reijnders:mil mci
Rayan Aït-Nouri:wol mci
Rayan Cherki:lyon mci
Josko Gvardiol:rbl mci
Nathan Aké:che bou mci
Matheus Nunes:spo wol mci
Savinho:mci
Jérémy Doku:mci
Erling Haaland:bod mol dor mci
Julián Álvarez:mci atm
Kevin De Bruyne:che wol mci nap
Ilkay Gündogan:dor mci bar
Bernardo Silva:mon mci
Kyle Walker:tot mci mil
Jack Grealish:avl mci eve
Cole Palmer:mci che
Romeo Lavia:sou che
Moisés Caicedo:bha che
Enzo Fernández:ben che
Nicolas Jackson:vil che bay
Joao Pedro:wat bha che
Liam Delap:ips che
Jamie Gittens:dor che
Estevão:che
Mykhailo Mudryk:sha che
Christopher Nkunku:rbl che mil
Raheem Sterling:che ars
Conor Gallagher:cry che atm
Álvaro Morata:atm che juv mil com gal
Pedro Neto:wol che
Dario Essugo:spo che
Marc Cucurella:bha che
Axel Disasi:mon che
Malo Gusto:lyon che
Trevoh Chalobah:cry che
Cole Palmer:che
Xavi Simons:psv psg rbl tot
Mohammed Kudus:ajax wham tot
Mathys Tel:bay tot
Richarlison:eve tot wat
Dominic Solanke:bou tot
James Maddison:lei tot
Dejan Kulusevski:juv tot par
Pedro Porro:spo tot man
Cristian Romero:ata juv tot
Micky van de Ven:wol tot
Son Heung-min:lev tot
Harry Kane:tot bay
Yves Bissouma:bha tot
Lucas Moura:psg tot
Alexander Sørloth:atm vil
Alexander Sørloth:cry
Tomas Soucek:sla wham
Nick Woltemade:stu new
Anthony Gordon:eve new
Sandro Tonali:mil bre new
Bruno Guimarães:new lyon
Alexander Isak:new
Anthony Elanga:nfo new
Jacob Murphy:new
Jacob Ramsey:avl new
Emiliano Martínez:ars avl
Ollie Watkins:bre avl
Morgan Rogers:avl
Youri Tielemans:lei avl mon
Lucas Digne:psg bar avl eve
Douglas Luiz:avl juv nfo
Leon Bailey:lev avl rom
Jhon Durán:avl fen
Donyell Malen:psv dor avl
Marcus Rashford:avl
Amadou Onana:eve avl lil
Ezri Konsa:avl
Pau Torres:vil avl
Alberto Moreno:liv vil
Gerard Moreno:vil
Alexander Sørloth:vil
Ayoze Pérez:new lei bet vil
Dani Parejo:val vil
Unai Emery:avl
Antoine Griezmann:soc atm bar
Álvaro Morata:rma
Nahuel Molina:atm udi
Thiago Almada:atm
Conor Gallagher:atm
Giuliano Simeone:atm
Jan Oblak:atm
Rodrigo De Paul:val atm udi
Marcos Llorente:rma atm
Koke:atm
Ángel Correa:atm
Joao Felix:atm
Iago Aspas:cel lvt
Jude Bellingham:dor rma bir
Aurélien Tchouaméni:mon rma
Eduardo Camavinga:rma
Vinícius Júnior:rma
Rodrygo:rma
Endrick:rma
Arda Güler:rma fen
Antonio Rüdiger:stu che rom rma
David Alaba:bay rma
Eder Militão:por rma
Fran García:ray rma
Brahim Díaz:mci mil rma
Thibaut Courtois:atm che rma
Luka Modrić:tot rma mil
Nico Williams:ath
Dani Carvajal:lev rma
Lucas Vázquez:esp rma
Rafael Leão:lil mil
Christian Pulisic:dor che mil
Luka Jović:rma fio mil
Strahinja Pavlović:sal mil
Youssouf Fofana:mon mil
Santiago Giménez:fey mil
Rafael Leao:mil
Adrien Rabiot:psg juv mar mil
Samuele Ricci:tor mil
Ardon Jashari:bru mil
Mike Maignan:lil mil
Luka Modric:mil
Christian Pulisic:mil
Romelu Lukaku:che eve mun inter rom nap
Scott McTominay:mun nap
Rasmus Højlund:nap
Noa Lang:psv nap
Alessandro Buongiorno:tor nap
Billy Gilmour:bha nap
Sam Beukema:bol nap
Lorenzo Lucca:udi nap
Antonio Conte:che tot juv inter nap
David Neres:ben nap
Alisson Santos:nap
Amir Rrahmani:ver nap
Leonardo Spinazzola:juv rom nap
Stanislav Lobotka:cel nap
Alessandro Bastoni:ata inter
Federico Dimarco:ver inter
Denzel Dumfries:psv inter
Hakan Çalhanoğlu:lev mil inter
Henrikh Mkhitaryan:dor mun ars rom inter
Marcus Thuram:bor inter
Yann Sommer:bay inter
Lautaro Martínez:inter
Nicolò Barella:cag inter
Piotr Zieliński:nap inter
Davide Frattesi:sas inter
Carlos Augusto:mon inter
Manuel Akanji:dor mci inter
Benjamin Pavard:bay inter
Francesco Acerbi:sas laz inter
Mehdi Taremi:por inter
Marko Arnautović:inter bol
Luis Henrique:mar inter
Petar Sučić:inter
Ange-Yoan Bonny:par inter
Dušan Vlahović:fio juv
Kenan Yıldız:juv
Teun Koopmeiners:ata juv
Khéphren Thuram:nic juv
Jonathan David:lil juv
Lois Openda:lens rbl juv
Randal Kolo Muani:juv
Edon Zhegrova:lil juv
Pierre Kalulu:mil juv
Andrea Cambiaso:gen juv
Gleison Bremer:tor juv
Federico Gatti:juv
Manuel Locatelli:sas juv
Nicolás González:fio stu juv atm
Douglas Luiz:juv
Weston McKennie:sch juv
Paul Pogba:juv mun
Mateo Retegui:gen ata
Ademola Lookman:ata ful lei eve
Marten de Roon:ata
Charles De Ketelaere:bru mil ata
Gianluca Scamacca:sas wham ata
Sead Kolašinac:ars mar ata
Paulo Dybala:juv rom
Artem Dovbyk:gir rom
Evan Ndicka:fra rom
Lorenzo Pellegrini:rom
Gianluca Mancini:ata rom
Angeliño:man rom
Leandro Paredes:psg juv rom
Stephan El Shaarawy:mil rom
Matías Soulé:juv rom
Wesley França:rom
Manu Koné:bor rom
Zeki Çelik:lil rom
Mario Hermoso:atm rom
Nicolò Zaniolo:rom gal avl ata fio
Kasper Dolberg:ajax sev
Dayot Upamecano:rbl bay
Luis Díaz:por liv bay
Michael Olise:cry bay
Harry Kane:bay
Jonathan Tah:lev bay
Joshua Kimmich:rbl stu bay
Serge Gnabry:ars wer bay
Leroy Sané:sch mci bay gal
Kingsley Coman:psg juv bay
Konrad Laimer:rbl bay
Raphaël Guerreiro:dor bay
Aleksandar Pavlović:bay
Nicolas Jackson:bay
Jamal Musiala:che bay
Karim Adeyemi:sal dor
Serhou Guirassy:stu dor
Julian Brandt:lev dor
Waldemar Anton:stu dor
Maximilian Beier:hof dor
Jobe Bellingham:sun dor
Felix Nmecha:wol dor
Marcel Sabitzer:rbl bay dor
Niklas Süle:bay dor
Emre Can:lev dor
Gregor Kobel:dor
Donyell Malen:dor
Ramy Bensebaini:dor
Jamie Gittens:dor
Fábio Silva:por wol dor
Daniel Svensson:dor
Yan Couto:mci dor
Nico Schlotterbeck:dor
Pascal Groß:bha dor
Ibrahima Konaté:rbl liv
Dominik Szoboszlai:rbl liv
Cody Gakpo:psv liv
Alisson Becker:rom liv
Virgil van Dijk:cel sou liv
Mohamed Salah:bas che fio rom liv
Andrew Robertson:hul liv
Wataru Endō:stu liv
Ryan Gravenberch:ajax bay liv
Curtis Jones:liv
Darwin Núñez:ben alm liv
Federico Chiesa:fio juv liv
Giorgi Mamardashvili:val liv
Alexis Mac Allister:bha liv
Joe Gomez:cha liv
Luis Suárez:ajax liv bar atm
Diogo Jota:wol por atl liv
Kostas Tsimikas:oly liv
Jarell Quansah:liv lev
Álvaro Arbeloa:liv rma
Ibrahim Konaté:liv
Antoine Semenyo:bou mci
Marc Guéhi:cry mci
Emiliano Buendía:avl lev
Dean Henderson:cry
Ismaïla Sarr:wat cry
Jean-Philippe Mateta:cry
Maxence Lacroix:wol cry
Adam Wharton:bla cry
Yeremi Pino:vil cry
Mohamed Salah:liv
Xabi Alonso:soc liv rma bay
Alexander Isak:dor soc new liv
Bernardo Silva:mon mci ben rma
Yan Diomande:rbl rma
Morgan Rogers:avl che
Elliot Anderson:new nfo mci
Enzo Fernández:ben che mci
Sandro Tonali:mil bre new tot
Mateus Fernandes:wham tot
Marc Cucurella:bar get bha che rma
Anthony Gordon:eve new bar
Bruno Guimarães:lyon new ars
Gonçalo Ramos:ben psg mil
Marco Palestra:ata che
Maxence Lacroix:wol cry che
Karim Adeyemi:sal dor bar
Ibrahima Konaté:rbl liv rma
Denzel Dumfries:psv inter rma
Gabriel Jesus:mci ars bar
Nick Woltemade:stu new juv
Pedri:lpa bar
Gavi:bar
Lamine Yamal:bar
Pau Cubarsí:bar
Alejandro Balde:bar
Fermín López:bar
Marc Casadó:bar
Eric García:mci gir bar
Marc-André ter Stegen:bmg bar
Wojciech Szczęsny:ars juv bar
Álex Baena:vil atm
Pablo Barrios:atm
Koke:atm
Marcos Llorente:rma atm
Dani Carvajal:rma lev
Álvaro Carreras:ben rma
Arda Güler:rma
Oihan Sancet:ath
Mikel Oyarzabal:soc
Mikel Merino:soc ars
Martin Zubimendi:soc ars
Ronald Araújo:bar
Federico Valverde:rma
Rodrygo:rma
Vinícius Júnior:rma
Éder Militão:rma
Jude Bellingham:bir dor rma
Jules Koundé:bor sev bar
Aurélien Tchouaméni:rma
William Saliba:ars
Gabriel Magalhães:ars
Phil Foden:mci
Joan García:bar
João Neves:ben psg
Vitinha:psg
Luis Díaz:liv bay
Viktor Gyökeres:ars
Lamine Yamal:bar
`;

export const CAREERS = BASE_CAREERS + SQUADS + "\n" + BUNDESLIGA_CAREERS + "\n" + LIGUE1_CAREERS + "\n" + SUPERLIG_CAREERS + "\n";
