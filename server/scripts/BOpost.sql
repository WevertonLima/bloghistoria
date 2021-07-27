--#consultar#

SELECT
	n.idnoticia
    , n.titulo
    , n.capa
    , n.descricao
    , DATE_FORMAT(n.datapub, "%d/%m/%Y") as datapub
    , n.ativo
FROM 
	noticia as n
ORDER BY
	n.datapub DESC

--END#consultar#