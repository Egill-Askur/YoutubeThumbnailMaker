# Skýrsla yfir einstaklingsverkefnið í Vefforritun 2

## Inngangur:
Verkefnið mitt er Youtube Thumbnail generator fyrir bardagaleikjafélag mitt FGCIceland.
Við höldum nefnilega bardagaleikjamót nokkrum sinnum í mánuð, en þá streymum við síðustu 10 leikina á Twitch (twitch.tv/fgciceland). Eftir að mótið er búið klippum við svo þessar upptökur og setjum þær á youtube rás okkar svo að fólk getur skoðað þær aftur og lært af mistökum sínum. 
Eitt mesta vesenið með að posta þessi VODs er að búa til þessar svokallaðar thumbnails, enda sérhönnum við hvert thumbnail eftir því hvaða karakterar eru notaðir, hverjir voru að spila, hvaða set í bracketinu var tekið og svo að sjálfsögðu dagsetning og nafn mótsins. Hingað til höfum við bara notað photoshop til að búa þetta til, en það tekur rosalegan tíma og er dáldið mikið bottleneck í þessu ferli.
Þar sem ég hef ekki fundið neinn svipaður generator eftir mikla leit á netinu ákvað ég einfaldlega að búa til minn eiginn. Ég fekk innblástur að verkefninu frá aðra vefsíðu sem við notum mikið sem kallast top8er.com, enda gerir það eitthvað svipað nema býr til eitt graf af spilurunum sem náðu 8 efstu sætin.

## Skilyrði:
Skilyrðin sem ég setti fram voru að nota Figma og node.js og útfæra framenda og bakenda, auk þess að implementa alla fídusa sem svona verkefni þarf, til dæmis að búa til rétta hönnun á thumbnail, geta notað start.gg hlekk til að fylla út allt data sjálfkrafa, geta breytt öllu sjálfur eftir á og svo framvegis. Ég tel mig hafa uppfyllt flest allt af því, enda bjó ég til flott Figma skjal, hef notfært mig af node.js og búið til framenda og bakenda. Það eina sem ég náði ekki að gera er að hafa support fyrir fleiri leiki heldur en Guilty Gear Strive, en ég hannaði grunnin með skalanleika í huga svo það verður ekki mikið vesen að koma því inn í framtíðinni.

## Tækni:
Ég notaði Node.js, React og JSZip. Node.js og React var notað því að það er þægilegt að vinna með og var kennt í þessum áfanga, og mig langaði að nýta tækifærið til að æfa mig í þeim í mun stærra verkefni heldur en hefur verið hingað til. JSZip var notað til að geta hlaðað niður öll thumbnails í einni .zip skrá, bara svo að forritið er þægilegra að vinna með þegar það verður notað í alvöru heimi.

## Hvað gekk vel?
Ég verð að segja að ég er mjög stoltur yfir loka product:ið. Þetta er mjög hraðvirkt og hefur öll aukaatriði sem ég hefði viljað þótt ég væri ekki að búa til vefsíðuna sjálfur. Að búa til thumbnailin sjálf reyndist ekki jafn erfitt og ég var hræddur um, og það var rosalega gott að hafa ChatGPT til að hjálpa mig með allskonar spurningar og pælingar sem ég átti varandi þessu. Ég var líka duglegur í að vinna þetta samviskusamlegt, en ég var mjög lítið að fresta því að vinna verkefnið eða taka langar pásur.

## Hvað gekk illa?
Ég fekk að læra það first-hand að við mikla notkun heimilda eins og ChatGPT eða almennar spjallsíður verður verkefni hratt mjög óskipulagt þar sem margar mismunandi aðferðir voru notaðar sem ekkert endilega passa vel við hvort annað. Í endanum varð verkefnið erfitt að bæta og breyta, enda varð að passa að vekja ekki spaghettí skrímslið. Hinsvegar finnst mér að ég hef lært mikið af þessu þrátt fyrir því, og ég mun geta skipulagt þetta betur og unnið hraðar ef ég geri það upp á nýtt.
Svo var líka mikið vesen að nota start.gg apann, enda var ekkert rosalega góð skjölun fyrir honum en ég hef heldur ekki mikið notað svona API queries áður. Þetta var hins vegar líka mjög lærdómsríkt fyrir mig, enda mun ég kunna að nota svipuð API betur næst.

## Hvað var áhugavert?
Mér fannst það áhugavert hversu fókuseraður ég náði að vera þegar ég vann að skipulagri markmiði sem ég hefði gaman af og leiddi að alvöru product sem ég vildi sjá verða að veruleika. Þótt að ég sé ennþá ekkert rosalega góður í vefforritun finnst mér þetta mun skemmtilegra heldur en eitthvað meira stærðfræðitengt, og ég hugsa að ég mun halda áfram að reyna búa til vefi í framtíðinni.