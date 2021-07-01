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
	ativo = 1 AND capa IS NOT NULL
ORDER BY
	acessos DESC
LIMIT 6

--END#obterpostspopulares#

--#obterpostporid#

SELECT
	n.idnoticia
    , n.titulo
    , n.capa
    , n.descricao
    , n.conteudo
    , DATE_FORMAT(n.datapub, "%d/%m/%Y") as datapub
    , n.acessos
    , (SELECT COUNT(*) FROM comentario WHERE idnoticia = n.idnoticia) as comentarios
    , (SELECT COUNT(*) FROM curtida WHERE idnoticia = n.idnoticia) as curtidas
FROM 
	noticia as n
WHERE
	n.idnoticia = @idnoticia
    AND n.ativo = 1

--END#obterpostporid#

--#obtercomentarios#

SELECT
	c.idcomentario
    , c.idusuario
    , c.texto
    , DATE_FORMAT(c.datacad,'%d/%m/%Y às %H:%i') as datacad
    , u.nome
    , u.avatar
FROM 
	comentario c
    JOIN usuario u ON u.idusuario = c.idusuario
WHERE
    idnoticia = @idnoticia
	AND excluido = 0
ORDER BY 
	datacad DESC

--END#obtercomentarios#

--#obtercurtidausuario#

SELECT
	*
FROM 
	curtida 
WHERE
	idnoticia = @idnoticia
    AND idusuario = @idusuario

--END#obtercurtidausuario#

--#obtertagspost#

SELECT
	t.descricao
FROM 
	noticiatag nt
    INNER JOIN tag as t ON t.idtag = nt.idtag
WHERE
	nt.idnoticia = @idnoticia
    AND t.ativo = 1
ORDER BY
	t.descricao

--END#obtertagspost#