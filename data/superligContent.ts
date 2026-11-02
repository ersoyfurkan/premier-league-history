import { player, type MarketValuePlayer } from "@/data/marketPlayer";
import type { RondoClue } from "@/data/rondo";

export const SUPERLIG_MARKET: MarketValuePlayer[] = [
 player("Mauro Icardi","Argentina","ar","68863",[{value:35,year:2018,club:"Inter Milan"},{value:75,year:2019,club:"Paris Saint-Germain"},{value:28,year:2022,club:"Paris Saint-Germain"},{value:20,year:2023,club:"Galatasaray"},{value:17,year:2024,club:"Galatasaray"}]),
 player("Victor Osimhen","Nigeria","ng","401923",[{value:3,year:2020,club:"Lille"},{value:50,year:2022,club:"Napoli"},{value:100,year:2023,club:"Napoli"},{value:75,year:2024,club:"Galatasaray"},{value:70,year:2025,club:"Galatasaray"}]),
 player("Kerem Aktürkoğlu","Türkiye","tr","382528",[{value:0.1,year:2019,club:"24 Erzincanspor"},{value:6,year:2021,club:"Galatasaray"},{value:15,year:2023,club:"Galatasaray"},{value:25,year:2024,club:"Benfica"},{value:18,year:2025,club:"Fenerbahçe"}]),
 player("Arda Güler","Türkiye","tr","861410",[{value:0.9,year:2021,club:"Fenerbahçe"},{value:15,year:2023,club:"Real Madrid"},{value:45,year:2024,club:"Real Madrid"},{value:60,year:2025,club:"Real Madrid"}]),
 player("Hakan Çalhanoğlu","Türkiye","tr","126414",[{value:5,year:2014,club:"Bayer Leverkusen"},{value:25,year:2017,club:"AC Milan"},{value:35,year:2020,club:"Inter Milan"},{value:45,year:2023,club:"Inter Milan"},{value:40,year:2025,club:"Inter Milan"}]),
 player("Cengiz Ünder","Türkiye","tr","258306",[{value:1,year:2016,club:"İstanbul Başakşehir"},{value:25,year:2018,club:"Roma"},{value:18,year:2021,club:"Olympique Marseille"},{value:15,year:2023,club:"Fenerbahçe"}]),
 player("Ferdi Kadıoğlu","Türkiye","tr","346584",[{value:0.6,year:2018,club:"Fenerbahçe"},{value:5,year:2021,club:"Fenerbahçe"},{value:20,year:2023,club:"Fenerbahçe"},{value:30,year:2024,club:"Brighton"}]),
 player("Orkun Kökçü","Türkiye","tr","327989",[{value:2,year:2019,club:"Feyenoord"},{value:12,year:2021,club:"Feyenoord"},{value:30,year:2023,club:"Benfica"},{value:25,year:2025,club:"Benfica"}]),
 player("Enes Ünal","Türkiye","tr","253274",[{value:0.5,year:2015,club:"Bursaspor"},{value:5,year:2017,club:"Villarreal"},{value:14,year:2022,club:"Getafe"},{value:14,year:2024,club:"Bournemouth"}]),
 player("Yusuf Yazıcı","Türkiye","tr","386053",[{value:1.5,year:2018,club:"Trabzonspor"},{value:17,year:2019,club:"Lille"},{value:12,year:2021,club:"Lille"},{value:10,year:2023,club:"Lille"}]),
 player("Edin Džeko","Bosnia and Herzegovina","ba","6194",[{value:25,year:2012,club:"Manchester City"},{value:20,year:2015,club:"AS Roma"},{value:10,year:2018,club:"AS Roma"},{value:4,year:2023,club:"Fenerbahçe"},{value:2,year:2025,club:"Fenerbahçe"}]),
 player("Dušan Tadić","Serbia","rs","36139",[{value:15,year:2016,club:"Southampton"},{value:15,year:2018,club:"Ajax"},{value:12,year:2021,club:"Ajax"},{value:5,year:2023,club:"Fenerbahçe"}]),
 player("Wilfried Zaha","Côte d'Ivoire","ci","145988",[{value:25,year:2018,club:"Crystal Palace"},{value:40,year:2019,club:"Crystal Palace"},{value:22,year:2022,club:"Crystal Palace"},{value:12,year:2023,club:"Galatasaray"}]),
 player("Dries Mertens","Belgium","be","56416",[{value:25,year:2016,club:"Napoli"},{value:30,year:2018,club:"Napoli"},{value:10,year:2021,club:"Napoli"},{value:3,year:2022,club:"Galatasaray"}]),
 player("Gedson Fernandes","Portugal","pt","337303",[{value:15,year:2019,club:"Benfica"},{value:10,year:2020,club:"Tottenham Hotspur"},{value:6,year:2022,club:"Beşiktaş"},{value:18,year:2025,club:"Beşiktaş"}]),
 player("İrfan Can Kahveci","Türkiye","tr","286384",[{value:1.2,year:2016,club:"Başakşehir"},{value:7,year:2019,club:"Başakşehir"},{value:10,year:2021,club:"Fenerbahçe"},{value:8,year:2024,club:"Fenerbahçe"}]),
];

const FACTS_RAW: string = `
Hakan Şükür|tur|gal int tor|won g100 a300
Metin Oktay|tur|gal|won g100
Tanju Çolak|tur|gal sam|won g100
Burak Yılmaz|tur|tra gal bes|won g100 a300
Alex de Souza|bra|fen|won
Aykut Kocaman|tur|fen|won g100 a300
Feyyaz Uçar|tur|bes|won g100
Sergen Yalçın|tur|bes gal fen|won
Arif Erdem|tur|gal|won g100
Rıdvan Dilmen|tur|fen|won
Oğuz Çetin|tur|fen|won a300
Semih Şentürk|tur|fen|won g50
Mauro Icardi|arg|gal|won
Edin Džeko|bih|fen|g50
Dries Mertens|bel|gal|won
Bafétimbi Gomis|fra|gal|won g50
Mbaye Diagne|sen|gal kas|won g50
Vágner Love|bra|ala bes|g50
Dirk Kuyt|ned|fen|won
Robin van Persie|ned|fen|won
Didier Drogba|civ|gal|won
Nicolas Anelka|fra|fen|g50
Mario Jardel|bra|gal|won
Tugay Kerimoğlu|tur|gal|won
Bülent Korkmaz|tur|gal|won a300
Tümer Metin|tur|bes|won g50
İlhan Mansız|tur|bes|won
Nihat Kahveci|tur|bes|won g50
Fatih Tekke|tur|tra|g50
Gökdeniz Karadeniz|tur|tra|won g50
Şota Arveladze|geo|tra|g50
Umut Bulut|tur|tra gal|won a300 g50
Selçuk İnan|tur|gal|won a300
Emre Belözoğlu|tur|fen gal|won a300
Volkan Demirel|tur|fen|won a300
Rüştü Reçber|tur|fen bes|won a300
Fernando Muslera|uru|gal|won a300
Gheorghe Hagi|rou|gal|won
Gheorghe Popescu|rou|gal|won
Mario Gomez|ger|bes|won g50
Ricardo Quaresma|por|bes|won
Demba Ba|sen|bes|won g50
Anderson Talisca|bra|bes|won
Vincent Aboubakar|cmr|bes|won g50
Enner Valencia|ecu|fen|g50
Moussa Sow|sen|fen|won g50
Pierre van Hooijdonk|ned|fen|won
Miroslav Stoch|svk|fen|won
Edin Višća|bih|ibf|won a300
İrfan Can Kahveci|tur|fen ibf|won
Kerem Aktürkoğlu|tur|gal fen|won
Arda Turan|tur|gal|won
Yusuf Yazıcı|tur|tra|won
Cengiz Ünder|tur|fen|g50
Cenk Tosun|tur|bes|won g50
Uğurcan Çakır|tur|tra|won
Alexandru Maxim|rou|gaz|g50
Vedat Muriqi|kos|fen|g50
Nani|por|fen|won
Tayfur Havutçu|tur|bes|won a300
İbrahim Üzülmez|tur|bes|won a300
Rüştü Reçber|tur|bes fen|won a300
Bülent Korkmaz|tur|gal|won a300
Hasan Şaş|tur|gal|won
Ümit Davala|tur|gal|won
Ergün Penbe|tur|gal|won
Hakan Balta|tur|gal|won
Sabri Sarıoğlu|tur|gal|won a300
Selçuk İnan|tur|gal|won a300
Hakan Şükür|tur|gal|won g100 a300
Tanju Çolak|tur|gal|won g100
Metin Oktay|tur|gal|won g100
Burak Yılmaz|tur|tra gal bes|won g100 a300
Necati Ateş|tur|gal|won
Ümit Karan|tur|gal|won
Milan Baroš|cze|gal|won g50
Shabani Nonda|cod|gal|won
Harry Kewell|aus|gal|won
Wesley Sneijder|ned|gal|won
Felipe Melo|bra|gal|won
Yasin Öztekin|tur|gal|won
Arda Turan|tur|gal|won
Tugay Kerimoğlu|tur|gal|won
Hakan Ünsal|tur|gal|won
Metin Tekin|tur|bes|won
Rıza Çalımbay|tur|bes|won a300
Feyyaz Uçar|tur|bes|won g100
Ali Gültiken|tur|bes|won
Nihat Kahveci|tur|bes|won
Sergen Yalçın|tur|bes|won
İlhan Mansız|tur|bes|won
Oktay Derelioğlu|tur|bes|g50
Gökhan Töre|tur|bes|won
Atiba Hutchinson|can|bes|won a300
Ricardo Quaresma|por|bes|won
Demba Ba|sen|bes|won
Mario Gomez|ger|bes|won
Anderson Talisca|bra|bes|won
Vincent Aboubakar|cmr|bes|won
Burak Yılmaz|tur|bes|won
Aykut Kocaman|tur|fen|won g100
Müjdat Yetkiner|tur|fen|won a300
Şenol Çorlu|tur|fen|won
Rıdvan Dilmen|tur|fen|won
Oğuz Çetin|tur|fen|won a300
Tanju Çolak|tur|fen|g100
Elvir Bolić|bih|fen|won
Tuncay Şanlı|tur|fen|won g50
Alex de Souza|bra|fen|won g50
Pierre van Hooijdonk|ned|fen|won
Dirk Kuyt|ned|fen|won
Moussa Sow|sen|fen|won
Robin van Persie|ned|fen|won
Enner Valencia|ecu|fen|g50
Edin Džeko|bih|fen|g50
Dusan Tadic|srb|fen|won
Volkan Demirel|tur|fen|won a300
Emre Belözoğlu|tur|fen|won a300
Can Bartu|tur|fen|won
Hami Mandıralı|tur|tra|won g50
Şenol Güneş|tur|tra|won
Fatih Tekke|tur|tra|g50
Gökdeniz Karadeniz|tur|tra|won
Şota Arveladze|geo|tra|g50
Giray Bulak|tur|tra|won
Ogün Temizkanoğlu|tur|tra|won a300
Gökhan Ünal|tur|tra|g50
Umut Bulut|tur|tra gal|won g50 a300
Burak Yılmaz|tur|tra gal bes|won g100
Yusuf Yazıcı|tur|tra|won
Uğurcan Çakır|tur|tra|won
Andreas Cornelius|den|tra|won
Paul Onuachu|nga|tra|g50
İbrahim Üzülmez|tur|riz|won
Emrah Başsan|tur|erz|g50
Mame Thiam|sen|kas fen|g50
Gökhan Gönül|tur|fen bes|won a300
Uğur Boral|tur|fen bes|won
Cenk Tosun|tur|bes|won g50
Nuri Şahin|tur|ant|won
Edin Višća|bih|ibf tra|won a300
Emre Belözoğlu|tur|ibf fen|won
Mahmut Tekdemir|tur|ibf|won a300
Mert Günok|tur|ibf|won
Demba Ba|sen|ibf|won
Enzo Crivelli|fra|ibf|won
İrfan Can Kahveci|tur|ibf fen|won
Moussa Sow|sen|ibf|won
Alexandru Maxim|rou|gaz|g50
Furkan Soyalp|tur|gaz|g50
Günay Güvenç|tur|gaz|g50
Maxim|rou|gaz|g50
Oğuz Ceylan|tur|gaz|g50
Kitsiou|gre|gaz|g50
Berkay Özcan|tur|ibf|won
Taylan Antalyalı|tur|gal|won
Berkan Kutlu|tur|gal|won
Kerem Demirbay|ger|gal|won
Barış Alper Yılmaz|tur|gal|won
Abdülkerim Bardakcı|tur|gal|won
Kaan Ayhan|tur|gal|won
Davinson Sánchez|col|gal|won
Victor Osimhen|nga|gal|won
Lucas Torreira|uru|gal|won
Hakim Ziyech|mar|gal|won
Yunus Akgün|tur|gal|won
Mertens|bel|gal|won
Okan Buruk|tur|gal|won
Fernando Muslera|uru|gal|won a300
Dries Mertens|bel|gal|won
Mauro Icardi|arg|gal|won
Eldor Shomurodov|uzb|ibf|g50

Alanyaspor: Alaeddine Touba|alg|ala
Alanyaspor: Efecan Karaca|tur|ala
Alanyaspor: Yusuf Özdemir|tur|ala
Alanyaspor: Hwang Ui-jo|kor|ala
Alanyaspor: Florent Hadergjonaj|kos|ala
Alanyaspor: Jure Balkovec|svn|ala
Amed SFK: Mehmet Yeşil|tur|amd
Amed SFK: Çekdar Orhan|tur|amd
Amed SFK: Murat Uçar|tur|amd
Amed SFK: Sinan Kurt|tur|amd
Amed SFK: Oktay Aydın|tur|amd
Amed SFK: Adama Traoré|mli|amd
Beşiktaş: Mert Günok|tur|bes
Beşiktaş: Ersin Destanoğlu|tur|bes
Beşiktaş: Gedson Fernandes|por|bes
Beşiktaş: Milot Rashica|kos|bes
Beşiktaş: Rafa Silva|por|bes
Beşiktaş: Ciro Immobile|ita|bes
Çaykur Rizespor: Altin Zeqiri|kos|riz
Çaykur Rizespor: Ibrahim Olawoyin|nga|riz
Çaykur Rizespor: Dal Varešanović|bih|riz
Çaykur Rizespor: Mithat Pala|tur|riz
Çaykur Rizespor: Amir Hadžiahmetović|bih|riz
Çaykur Rizespor: Casper Højer|den|riz
Erzurumspor: Eren Tozlu|tur|erz
Erzurumspor: Mustafa Yumlu|tur|erz
Erzurumspor: Orhan Ovacıklı|tur|erz
Erzurumspor: Celal Hanalp|tur|erz
Erzurumspor: Sefa Akgün|tur|erz
Erzurumspor: Yakup Kırtay|tur|erz
Eyüpspor: Umut Bozok|tur|eyu
Eyüpspor: Emre Akbaba|tur|eyu
Eyüpspor: Caner Erkin|tur|eyu
Eyüpspor: Berke Özer|tur|eyu
Eyüpspor: Dorukhan Toköz|tur|eyu
Eyüpspor: Mame Thiam|sen|eyu
Fenerbahçe: Edin Džeko|bih|fen
Fenerbahçe: Dušan Tadić|srb|fen
Fenerbahçe: Fred|bra|fen
Fenerbahçe: İrfan Can Kahveci|tur|fen
Fenerbahçe: Bright Osayi-Samuel|nga|fen
Fenerbahçe: Youssef En-Nesyri|mar|fen
Galatasaray: Mauro Icardi|arg|gal
Galatasaray: Victor Osimhen|nga|gal
Galatasaray: Fernando Muslera|uru|gal
Galatasaray: Lucas Torreira|uru|gal
Galatasaray: Davinson Sánchez|col|gal
Galatasaray: Barış Alper Yılmaz|tur|gal
Gaziantep FK: Alexandru Maxim|rou|gaz
Gaziantep FK: Günay Güvenç|tur|gaz
Gaziantep FK: Furkan Soyalp|tur|gaz
Gaziantep FK: Deian Sorescu|rou|gaz
Gaziantep FK: Arda Kızıldağ|tur|gaz
Gaziantep FK: Denis Drăguș|rou|gaz
Gençlerbirliği: Bogdan Stancu|rou|gnc
Gençlerbirliği: Randall Azofeifa|crc|gnc
Gençlerbirliği: Filip Daems|bel|gnc
Gençlerbirliği: İlhan Cavcav|tur|gnc
Gençlerbirliği: Uğur Boral|tur|gnc
Gençlerbirliği: Aykut Demir|tur|gnc
Göztepe: Romulo|bra|goz
Göztepe: Juan Santos|bra|goz
Göztepe: David Tijanić|svn|goz
Göztepe: İsmail Köybaşı|tur|goz
Göztepe: Yalçın Kayan|tur|goz
Göztepe: Heliton|bra|goz
İstanbul Başakşehir: Edin Višća|bih|ibf
İstanbul Başakşehir: Mahmut Tekdemir|tur|ibf
İstanbul Başakşehir: İrfan Can Kahveci|tur|ibf
İstanbul Başakşehir: Mert Günok|tur|ibf
İstanbul Başakşehir: Enzo Crivelli|fra|ibf
İstanbul Başakşehir: Demba Ba|sen|ibf
Kasımpaşa: Mbaye Diagne|sen|kas
Kasımpaşa: Ryan Donk|ned|kas
Kasımpaşa: Trezeguet|egy|kas
Kasımpaşa: Haris Hajradinović|bih|kas
Kasımpaşa: Mamadou Fall|sen|kas
Kasımpaşa: Florent Hadergjonaj|kos|kas
Kocaelispor: Saffet Sancaklı|tur|koc
Kocaelispor: Taner Gülleri|tur|koc
Kocaelispor: Serdar Topraktepe|tur|koc
Kocaelispor: Orhan Kaynak|tur|koc
Kocaelispor: Bülent Baturman|tur|koc
Kocaelispor: Gökhan Bozkaya|tur|koc
Konyaspor: Guilherme|bra|kon
Konyaspor: Nejc Skubic|svn|kon
Konyaspor: Riad Bajić|bih|kon
Konyaspor: Adis Jahović|mkd|kon
Konyaspor: Ömer Ali Şahiner|tur|kon
Konyaspor: Soner Dikmen|tur|kon
Samsunspor: Yüksel Yıldırım|tur|sms
Samsunspor: Marius Mouandilmadji|cha|sms
Samsunspor: Olivier Ntcham|cmr|sms
Samsunspor: Zeki Yavru|tur|sms
Samsunspor: Emre Kılınç|tur|sms
Samsunspor: Carlo Holse|den|sms
Trabzonspor: Uğurcan Çakır|tur|tra
Trabzonspor: Enis Bardhi|mkd|tra
Trabzonspor: Paul Onuachu|nga|tra
Trabzonspor: Andreas Cornelius|den|tra
Trabzonspor: Marek Hamšík|svk|tra
Trabzonspor: Abdülkadir Ömür|tur|tra
Çorum FK: Thomas Verheydt|ned|cor
Çorum FK: Ahmet İlhan Özek|tur|cor
Çorum FK: Ferhat Yazgan|tur|cor
Çorum FK: Atakan Cangöz|tur|cor
Çorum FK: Geraldo|ang|cor
Çorum FK: Oğuz Gürbulak|tur|cor
`;

export const SUPERLIG_FACTS: string = (() => {
 const merged = new Map<string, { nation: string; clubs: Set<string>; tags: Set<string> }>();
 for (const raw of FACTS_RAW.split("\n")) {
  const line = raw.trim().replace(/^[^|]+: /, "");
  if (!line.includes("|")) continue;
  const [name, nation, clubs = "", tags = ""] = line.split("|");
  const item = merged.get(name) ?? { nation, clubs: new Set<string>(), tags: new Set<string>() };
  clubs.split(/\s+/).filter(Boolean).forEach((club) => item.clubs.add(club));
  tags.split(/\s+/).filter(Boolean).forEach((tag) => item.tags.add(tag));
  merged.set(name, item);
 }
 return [...merged].map(([name, item]) => `${name}|${item.nation}|${[...item.clubs].join(" ")}|${[...item.tags].join(" ")}`).join("\n");
})();
export const SUPERLIG_CAREERS: string = `${SUPERLIG_FACTS.split("\n").filter((line)=>line.includes("|") && !line.includes(":")).map((line)=>{const [name,,clubs]=line.split("|");return `${name}:${clubs}`}).join("\n")}
${`
Tanju Çolak:sam gal fen
Aykut Kocaman:fen
Feyyaz Uçar:bes
Sergen Yalçın:bes gal fen
Hakan Şükür:gal int
Arif Erdem:gal
Rıdvan Dilmen:fen
Oğuz Çetin:fen
Semih Şentürk:fen
Burak Yılmaz:bes gal tra
Alex de Souza:fen
Mauro Icardi:gal
Edin Džeko:fen
Dušan Tadić:ajax fen
Fred:mci fen
Mert Günok:bes ibf
Gedson Fernandes:ben bes
Milot Rashica:gal bes
Rafa Silva:ben bes
Ciro Immobile:bes
Mauro Icardi:inter psg gal
Victor Osimhen:nap gal
Fernando Muslera:laz gal
Lucas Torreira:ars gal
Davinson Sánchez:tot gal
Barış Alper Yılmaz:gal
Kerem Aktürkoğlu:gal ben fen
Dries Mertens:nap gal
Hakim Ziyech:ajax che gal
Yunus Akgün:gal lei
Okan Buruk:inter gal
Günay Güvenç:bes gaz
Alexandru Maxim:mainz gaz
Deian Sorescu:dinamo gaz
Bogdan Stancu:gal gnc
Randall Azofeifa:gnc
Filip Daems:gnc
Romulo:goz
Juan Santos:goz
David Tijanić:goz
İsmail Köybaşı:bes fen goz
Edin Višća:tra ibf
Mahmut Tekdemir:ibf
İrfan Can Kahveci:ibf fen
Enzo Crivelli:caen ibf
Demba Ba:chelsea bes ibf
Mbaye Diagne:kas gal
Ryan Donk:gal kas
Trezeguet:astonv villa kas
Haris Hajradinović:kon kas
Mamadou Fall:kas
Saffet Sancaklı:bes gal koc
Taner Gülleri:koc
Serdar Topraktepe:bes koc
Orhan Kaynak:tra koc
Guilherme:kon
Nejc Skubic:kon
Riad Bajić:udi kon
Adis Jahović:goz kon
Ömer Ali Şahiner:kon ibf
Soner Dikmen:kon
Yüksel Yıldırım:sms
Marius Mouandilmadji:sms
Olivier Ntcham:celtic sms
Zeki Yavru:tra sms
Emre Kılınç:gal samsun
Carlo Holse:sms
Uğurcan Çakır:tra
Enis Bardhi:lev tra
Paul Onuachu:tra
Andreas Cornelius:par tra
Marek Hamšík:nap tra
Abdülkadir Ömür:tra hull
Thomas Verheydt:cor
Ahmet İlhan Özek:cor
Ferhat Yazgan:cor
Geraldo:ang cor
Saffet Sancaklı:bes gal koc
Tanju Çolak:sam gal fen
Hakan Çalhanoğlu:mil inter
Arda Güler:fen rma
Orkun Kökçü:fey ben
Hakan Şükür:gal int tor
Blerim Džemaili:nap gal
Yuto Nagatomo:inter gal
Ryan Babel:ajax liv gal
Radamel Falcao:atm mon mun gal
Falcao:atm mon mun gal
Johan Elmander:bol gal
Emmanuel Eboué:ars gal
Didier Drogba:chelsea gal
Wesley Sneijder:inter gal
Felipe Melo:juv gal
Gheorghe Hagi:bar gal
Gheorghe Popescu:bar gal
Mario Jardel:por gal
Shabani Nonda:mon gal
Milan Baroš:liv gal
Harry Kewell:liv gal
Bafétimbi Gomis:lyon gal
Yasin Öztekin:gal goz
Tugay Kerimoğlu:gal rbl
Emre Belözoğlu:inter new fen
Nicolas Anelka:ars che fen
Pierre van Hooijdonk:fey fen
Dirk Kuyt:liv fen
Robin van Persie:ars mun fen
Moussa Sow:ren fen
Nani:mun val fen
Diego Lugano:psg fen
Bruno Alves:juv fen
Raul Meireles:liv che fen
Mehmet Topal:val fen
Caner Erkin:inter fen bes
Gökhan Gönül:bes fen
Tuncay Şanlı:mid fen
Alex de Souza:par fen
İsmail Kartal:fen
Jay-Jay Okocha:par fen
Elvir Bolić:gal fen
Rüştü Reçber:bar bes fen
Ricardo Quaresma:inter bes
Demba Ba:chelsea bes
Mario Gomez:fiore bes
Anderson Talisca:ben bes
Vincent Aboubakar:por bes
Pepe:por bes
Atiba Hutchinson:psv bes
Cenk Tosun:everton bes
Tümer Metin:fen bes
Nihat Kahveci:real bes
İlhan Mansız:bes
Oktay Derelioğlu:bes
Bobo:bes
Tayfur Havutçu:bes
Rıza Çalımbay:bes
Metin Tekin:bes
Ali Gültiken:bes
Feyyaz Uçar:bes
Sergen Yalçın:bes gal
Gökhan Töre:chelsea bes
Oğuzhan Özyakup:ars bes
Guti:real bes
Simão Sabrosa:atm bes
Rafa Silva:ben bes
Gedson Fernandes:ben bes
Salih Uçan:rom bes
Umut Bulut:gal tra
Şota Arveladze:ajax tra
Gökdeniz Karadeniz:tra rubin
Fatih Tekke:zen tra
Hami Mandıralı:tra
Ogün Temizkanoğlu:tra
Giray Bulak:tra
Abdülkadir Ömür:tra
Yusuf Yazıcı:lil tra
Alexander Sørloth:lei tra
Marek Hamšík:nap tra
John Obi Mikel:che tra
Florent Malouda:che tra
Gustavo Colman:tra
Burak Yılmaz:gal bes tra
Umut Bulut:tra gal
Sivasspor: siv
Roberto Carlos:rma siv
Arouna Koné:sev siv
Hakan Arslan:siv
Nihat Kahveci:bes
Arda Turan:bar atm gal
Emre Mor:celta borussia
Enes Ünal:bur get bournemouth
Cengiz Ünder:roma mar fen
Yusuf Yazıcı:tra lille
Merih Demiral:juv atalanta
Çağlar Söyüncü:lei atm fen
Zeki Çelik:rom
Kaan Ayhan:sas gal
Ozan Tufan:fen hull
Salih Özcan:dor
Kenan Yıldız:juv
Semih Kılıçsoy:bes
Arda Güler:fen rma
İsmail Yüksek:fen
Ferdi Kadıoğlu:fen bha
Altay Bayındır:fen mun
Taylan Antalyalı:gal samsun
Berkan Kutlu:gen gal
Kerem Demirbay:lev gal
Abdülkerim Bardakcı:kon gal
Kaan Ayhan:sas gal
Davinson Sánchez:tot gal
Victor Osimhen:nap gal
Lucas Torreira:ars gal
Hakim Ziyech:ajax che gal
Yunus Akgün:gal lei
Eldor Shomurodov:rom ibf
Paul Onuachu:genk tra
Eren Elmalı:kas tra
Serdar Saatçı:braga tra
Stefano Denswil:ajax tra
Trezeguet:aston villa kas tra
Rashica:wer nor gal bes
Kostas Fortounis:olympiacos
Fernando:man city gal sev
Badou Ndiaye:gal stoke
Garry Rodrigues:gal paok
Younès Belhanda:mont gal
Mbaye Diagne:kas gal
Mostafa Mohamed:nan gal
Haris Seferović:ben gal
Bafetimbi Gomis:lyon gal
Yerry Mina:everton
Ahmed Musa:lei
Islam Slimani:mon
Nabil Dirar:mon fen
Mame Thiam:fen kas eyu
Samuel Eto'o:bar inter bes
Samuel Eto’o:bar inter bes
Gökhan İnler:nap bes
Miroslav Stoch:che fen
Emmanuel Emenike:spm fen
Gregory van der Wiel:psg fen
Lazar Marković:liv fen
Simon Kjaer:sev fen
Luiz Gustavo:bayern fen
Vedat Muriqi:laz fen
Enner Valencia:west ham tigres fen
Jorge Jesus:ben fen
Roberto Mancini:inter gal
Fatih Terim:gal fio mil
Şenol Güneş:bes tra
Mustafa Denizli:gal bes
Christoph Daum:fen bes
Aykut Kocaman:kon fen
Ersun Yanal:tra fen
Okan Buruk:ibf gal
Tümer Metin:fen bes
Necati Ateş:gal ant
Tayfur Havutçu:bes gal
Mert Nobre:fen bes
Mehmet Yozgatlı:fen bes gal
Uğur Boral:bes fen gnc
Serhat Akın:fen and
Tuncay Şanlı:mid fen
Mehmet Topal:val fen ibf
Emre Aşık:bes gal
Ömer Erdoğan:brs
Yalçın Ayhan:ibf ant
Egemen Korkmaz:fen bes tra
Volkan Şen:brs fen tra
İbrahim Toraman:bes
Bobo:bes
Roberto Carlos:rma ibf
Samuel Eto'o:bar inter bes ant
Samir Nasri:ars mci ant
Jérémy Ménez:mil ant
Luiz Adriano:mil ant
Sandro:tot ant
Goran Pandev:nap gal
Fatih Akyel:fen gal
Mehmet Topuz:kay fen
Caner Erkin:inter fen bes gal
Özer Hurmacı:fen kas tra
Ozan İpek:brs ant
Serdar Aziz:brs gal
Pablo Batalla:brs
Ali Tandoğan:bes brs
Ertuğrul Ersoy:brs gaz
Salih Uçan:fen rom
Semih Kaya:gal spa
Yekta Kurtuluş:gal ant
Selçuk Şahin:fen ant
Hamit Altıntop:gal bay
Tolga Zengin:bes tra
Olcay Şahan:bes tra
Gökhan Töre:che bes
Veli Kavlak:bes
Ömer Toprak:lev wer
Ümit Özat:fen köln
Murat Yakın:bas
Mehmet Aurelio:fen bet
Nihat Özdemir:fen
Yıldıray Baştürk:her lev
Tuncay Şanlı:mid fen
Tümer Metin:bes fen
Ahmet Dursun:bes
Kubilay Türkyılmaz:gal
Cafu:gal
Claudio Taffarel:gal par
Capone:gal
Suat Kaya:gal
Hakan Ünsal:gal
Hasan Şaş:gal
Ümit Davala:gal
Ergün Penbe:gal
Okan Buruk:gal inter
Emre Belözoğlu:inter new fen
Gökhan İnler:nap besSami Hyypiä:liv

`}`;

const r = (letter: string, clue: string, answers: string, contains = false): RondoClue => ({ letter, clue, answers: answers.split("|"), contains });
const rondoPool: [string,string[],boolean?][] = [
["A",["Arda Turan","Alex de Souza","Aykut Kocaman","Alper Potuk","Atiba Hutchinson","Ahmet Çalık","Abdülkadir Ömür","Altay Bayındır"]],
["B",["Burak Yılmaz","Bülent Korkmaz","Bafétimbi Gomis","Beşiktaş","Bursaspor","Barış Alper Yılmaz","Bobo","Batalla"]],
["C",["Cenk Tosun","Cüneyt Çakır","Caner Erkin","Cengiz Ünder","Cemil Usta","Ciro Immobile","Çağlar Söyüncü","Cumhuriyet Stadyumu"]],
["D",["Demba Ba","Denizlispor","Didier Drogba","Dries Mertens","Diego Lugano","Dušan Tadić","Deivid","Deniz Türüç"]],
["E",["Emre Belözoğlu","Edin Džeko","Enner Valencia","Emre Mor","Eyüpspor","Enes Ünal","Ersun Yanal","Erol Bulut"]],
["F",["Fatih Terim","Fenerbahçe","Feyyaz Uçar","Fernando Muslera","Felipe Melo","Fatih Tekke","Fred","Ferdi Kadıoğlu"]],
["G",["Galatasaray","Göztepe","Gençlerbirliği","Gheorghe Hagi","Gökdeniz Karadeniz","Gökhan Gönül","Gedson Fernandes","Günay Güvenç"]],
["H",["Hakan Şükür","Hami Mandıralı","Hakan Çalhanoğlu","Hasan Şaş","Hakan Balta","Hamit Altıntop","Hugo Rodallega","Halil Dervişoğlu"]],
["I",["İstanbul Başakşehir","İrfan Can Kahveci","İlhan Mansız","İsmail Kartal","İbrahim Üzülmez","İbrahim Toraman","İlhan Cavcav","İzmir Atatürk Stadium"]],
["J",["Juan Mata","João Pereira","Jorge Jesus","Josef de Souza","Jaba","Júnior","Jorginho","Jean-Jacques Gosso"]],
["K",["Kasımpaşa","Konyaspor","Kocaelispor","Kerem Aktürkoğlu","Kenan Yıldız","Kaan Ayhan","Kevin Großkreutz","Karel Rada"]],
["L",["Lucas Torreira","Lucho González","Lincoln","László Bölöni","Lamine Diatta","Loris Karius","Levent Kırca","Levent Şahin"]],
["M",["Metin Oktay","Mauro Icardi","Mario Gomez","Mario Jardel","Muslera","Mert Günok","Mbaye Diagne","Mehmet Topal"]],
["N",["Nihat Kahveci","Nani","Necati Ateş","Nicolas Anelka","Nuri Şahin","Nonda","Nejc Skubic","Nihat Özdemir"]],
["O",["Oğuz Çetin","Okan Buruk","Oktay Derelioğlu","Ogün Temizkanoğlu","Okan Koç","Ozan Tufan","Orkun Kökçü","Okan Yılmaz"]],
["P",["Pierre van Hooijdonk","Pepe","Paul Onuachu","Papiss Cissé","Papy Djilobodji","Pascal Nouma","Goran Pandev","Pedro Franco"]],
["Q",["Qazim Laçi","Qurban Qurbanov","Ezequiel Scarione","Ezequiel Rescaldani","Qarabağ FK","Qatar","QPR","Shaqiri"],true],
["R",["Ricardo Quaresma","Rıdvan Dilmen","Rüştü Reçber","Rafa Silva","Rıza Çalımbay","Roberto Carlos","Ryan Babel","Robin van Persie"]],
["S",["Sergen Yalçın","Semih Şentürk","Şota Arveladze","Selçuk İnan","Samsunspor","Sivasspor","Salih Uçan","Serdar Aziz"]],
["T",["Trabzonspor","Tanju Çolak","Tugay Kerimoğlu","Tümer Metin","Tuncay Şanlı","Taner Gülleri","Tolga Zengin","Trezeguet"]],
["U",["Umut Bulut","Uğurcan Çakır","Ümit Karan","Ümit Davala","Uğur Boral","Uğur Tütüneker","Uğur Yıldırım","Ulaş Özdemir"]],
["V",["Vágner Love","Vedat Muriqi","Vincent Aboubakar","Volkan Demirel","Volkan Şen","Vitor Pereira","Victor Osimhen","Veli Kavlak"]],
["W",["Wesley Sneijder","Wilfried Zaha","William Carvalho","Wout Weghorst","Willian Arao","Walter Zenga","Wesley","Willy Sagnol"],true],
["X",["Xavi","Xabi Alonso","Xherdan Shaqiri","Alex Telles","Alexandre Pato","Maxi Pereira","Xavi Simons","Xavi Hernández"],true],
["Y",["Yusuf Yazıcı","Yasin Öztekin","Yılmaz Vural","Yüksel Yıldırım","Yalçın Ayhan","Yaya Touré","Yerry Mina","Yordan Minev"]],
["Z",["Zeki Rıza Sporel","Zeki Yavru","Zico","Zoran Simović","Zlatan Ibrahimović","Ziya Doğan","Zeki Çelik","Zdravko Kuzmanović"]],
];
export const SUPERLIG_RONDO: RondoClue[] = rondoPool.flatMap(([letter, answers, contains]) => answers.map((answer) => r(letter, "A notable player, club or figure connected with Turkish football.", answer, Boolean(contains))));

const list = (raw: string) => raw.split("|").map((item) => { const [name, ...aliases] = item.split("/"); return { name: name.trim(), aliases: aliases.map((a) => a.trim()) }; });
const cat = (id: string, noun: string, plural: string, raw: string) => ({ id: `s-sl-${id}`, noun, plural, raw });
export const SUPERLIG_TRIVIA: { id: string; noun: string; plural: string; raw: string }[] = [
 cat("champions","Süper Lig champion club","Süper Lig champion clubs","Galatasaray|Fenerbahçe/Fenerbahce|Beşiktaş/Besiktas|Trabzonspor|Bursaspor|İstanbul Başakşehir/Basaksehir"),
 cat("scorers","Gol Kralı winner","Gol Kralı winners","Metin Oktay|Tanju Çolak|Hakan Şükür|Aykut Kocaman|Alex de Souza|Burak Yılmaz|Fatih Tekke|Şota Arveladze|Mauro Icardi|Victor Osimhen/Osimhen|Paul Onuachu/Onuachu|Eldor Shomurodov/Shomurodov|Mario Jardel"),
 cat("stadiums","stadium of a current Süper Lig club","stadiums of current Süper Lig clubs","Rams Park/Ali Sami Yen|Şükrü Saracoğlu Stadium/Chobani Stadium|Tüpraş Stadyumu/Vodafone Park|Papara Park/Hüseyin Avni Aker|Başakşehir Fatih Terim Stadium|Alanya Oba Stadium|Samsun 19 Mayıs Stadium|Rize City Stadium|Konya Metropolitan Municipality Stadium|Gaziantep Stadium|Recep Tayyip Erdoğan Stadium|Gürsel Aksel Stadium|Eryaman Stadium|Kocaeli Stadium|Çorum Şehir Stadyumu|Kazım Karabekir Stadium"),
 cat("managers","manager who won the Süper Lig","managers who won the Süper Lig","Fatih Terim|Şenol Güneş|Mustafa Denizli|Aykut Kocaman|Christoph Daum|Okan Buruk|Mircea Lucescu|Gordon Milne|Jupp Derwall|Roberto Mancini|Ersun Yanal|Ziya Doğan"),
 cat("100goals","player with 100 Süper Lig goals","players with 100 Süper Lig goals","Hakan Şükür|Metin Oktay|Tanju Çolak|Aykut Kocaman|Burak Yılmaz|Feyyaz Uçar|Hami Mandıralı|Lefter Küçükandonyadis|Cemil Turan|Alex de Souza|Selçuk Yula|Necati Ateş"),
 cat("uefa-cup","member of Galatasaray's 1999–2000 UEFA Cup-winning squad","players in Galatasaray's 1999–2000 UEFA Cup-winning squad","Claudio Taffarel|Bülent Korkmaz|Gheorghe Popescu|Capone|Hakan Ünsal|Ümit Davala|Suat Kaya|Gheorghe Hagi|Hasan Şaş|Arif Erdem|Hakan Şükür|Tugay Kerimoğlu|Okan Buruk|Emre Belözoğlu|Marcio|Fatih Akyel|Ergün Penbe|Mehmet Yozgatlı"),
 cat("wc2002","member of Turkey's 2002 World Cup semi-final squad","players in Turkey's 2002 World Cup semi-final squad","Rüştü Reçber|Bülent Korkmaz|Alpay Özalan|Tugay Kerimoğlu|Emre Belözoğlu|Hasan Şaş|Hakan Şükür|İlhan Mansız|Nihat Kahveci|Ümit Davala|Ergün Penbe|Yıldıray Baştürk|Okan Buruk|Fatih Akyel|Hakan Ünsal|Tayfur Havutçu|Arif Erdem|Ümit Özat"),
 cat("euro2008","member of Turkey's EURO 2008 semi-final squad","players in Turkey's EURO 2008 semi-final squad","Rüştü Reçber|Volkan Demirel|Emre Aşık|Gökhan Zan|Servet Çetin|Hakan Balta|Sabri Sarıoğlu|Tuncay Şanlı|Arda Turan|Nihat Kahveci|Semih Şentürk|Mehmet Topal|Emre Belözoğlu|Kazım Kazım|Uğur Boral|Mehmet Aurelio|Hamit Altıntop|Nuri Şahin|Gökdeniz Karadeniz"),
 cat("foreign-stars","foreign star who played in Turkey","foreign stars who played in Turkey","Alex de Souza|Gheorghe Hagi|Mario Jardel|Didier Drogba|Nicolas Anelka|Wesley Sneijder|Ricardo Quaresma|Dirk Kuyt|Robin van Persie|Demba Ba|Mario Gomez|Dries Mertens|Mauro Icardi|Edin Džeko|Victor Osimhen|Hakan Çalhanoğlu"),
 cat("europe","Turkish club that reached a European competition semi-final or final","Turkish clubs that reached European competition semi-finals or finals","Galatasaray|Fenerbahçe|Beşiktaş|Trabzonspor|Sivasspor|İstanbul Başakşehir|Ankaragücü|Eskişehirspor|Göztepe|Samsunspor"),
 cat("cup","Turkish Cup winner","Turkish Cup winners","Galatasaray|Beşiktaş|Fenerbahçe|Trabzonspor|Ankaragücü|Konyaspor|Sivasspor|Kayserispor|Bursaspor|Gençlerbirliği|Altay|Göztepe"),
 cat("keepers","goalkeeper who won the Süper Lig","goalkeepers who won the Süper Lig","Fernando Muslera|Rüştü Reçber|Volkan Demirel|Şenol Güneş|Turgay Şeren|Claudio Taffarel|Andreas Isaksson|Fabien Farnolle|Mert Günok|Tolga Zengin|İlker Avcıbay|Oscar Cordoba"),
 cat("nicknames","nickname of a Turkish club","nicknames of Turkish clubs","Sarı Kanaryalar/Fenerbahçe|Cim Bom/Galatasaray|Kara Kartallar/Beşiktaş|Bordo-Mavililer/Trabzonspor|Timsahlar/Bursaspor|Boz Baykuşlar/Başakşehir|Gakgoşlar/Elazığspor|Kırmızı Şimşekler/Eskişehirspor|Yiğidolar/Sivasspor|Kara Kırmızı/Gençlerbirliği|Ege'nin Efeleri/Göztepe|Karadeniz Fırtınası/Trabzonspor"),
 cat("titles","Süper Lig championship season","Süper Lig championship seasons","1959|1959-60|1960-61|1961-62|1962-63|1963-64|1964-65|1965-66|1966-67|1967-68|1968-69|1969-70"),
 cat("legends","Turkish football legend","Turkish football legends","Lefter Küçükandonyadis|Metin Oktay|Turgay Şeren|Can Bartu|Hakan Şükür|Tanju Çolak|Rıdvan Dilmen|Oğuz Çetin|Sergen Yalçın|Fatih Terim|Hami Mandıralı|Tugay Kerimoğlu"),
];





