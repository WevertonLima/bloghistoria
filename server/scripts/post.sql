--#obterposts#

SELECT
	n.idnoticia
    , n.titulo
    , n.capa
    , n.descricao
    , DATE_FORMAT(n.datapub, "%d/%m/%Y") as datapub
    , n.acessos
    , (SELECT COUNT(*) FROM comentario WHERE idnoticia = n.idnoticia) as comentarios
    , (SELECT COUNT(*) FROM curtida WHERE idnoticia = n.idnoticia) as curtidas
FROM 
	noticia as n
WHERE
    n.ativo = 1
ORDER BY
	n.datapub DESC

--END#obterposts#


--#obterpostspopulares#

SELECT 
	idnoticia
    , titulo
    , descricao
    , capa
    , DATE_FORMAT(datapub, "%d/%m/%Y") as datapub
FROM 
	noticia
WHERE
	ativo = 1
ORDER BY
	acessos DESC
LIMIT 6

--END#obterpostspopulares#