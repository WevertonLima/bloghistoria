--#obterposts#

SELECT
	n.idnoticia
    , n.titulo
    , n.descricao
    , DATE_FORMAT(n.datapub, "%d/%m/%Y") as datapub
    , n.acessos
    , (SELECT COUNT(*) FROM comentario WHERE idnoticia = n.idnoticia AND excluido = 0) as comentarios
    , (SELECT COUNT(*) FROM curtida WHERE idnoticia = n.idnoticia) as curtidas
    , SUBSTRING(n.capa, 1, 25) as formato
FROM 
	noticia as n
WHERE
    n.ativo = 1
ORDER BY
	n.datapub DESC

--END#obterposts#

--#obterpostsportexto#

SELECT
	n.idnoticia
    , n.titulo
    , n.capa
    , n.descricao
    , DATE_FORMAT(n.datapub, "%d/%m/%Y") as datapub
    , n.acessos
    , (SELECT COUNT(*) FROM comentario WHERE idnoticia = n.idnoticia AND excluido = 0) as comentarios
    , (SELECT COUNT(*) FROM curtida WHERE idnoticia = n.idnoticia) as curtidas
FROM 
	noticia as n
WHERE
    n.ativo = 1
    AND (n.titulo like CONCAT('%', @texto, '%') OR n.descricao like CONCAT('%', @textoDesc, '%'))
ORDER BY
	n.datapub DESC

--END#obterpostsportexto#

--#obterpostsporcategoria#

SELECT
	n.idnoticia
    , n.titulo
    , n.capa
    , n.descricao
    , DATE_FORMAT(n.datapub, "%d/%m/%Y") as datapub
    , n.acessos
    , (SELECT COUNT(*) FROM comentario WHERE idnoticia = n.idnoticia AND excluido = 0) as comentarios
    , (SELECT COUNT(*) FROM curtida WHERE idnoticia = n.idnoticia) as curtidas
FROM 
	noticia as n
    JOIN categoria as c ON c.idcategoria = n.idcategoria
WHERE
    n.ativo = 1
    AND c.descricao like CONCAT('%', @texto, '%')
ORDER BY
	n.datapub DESC

--END#obterpostsporcategoria#

--#obterpostsportag#

SELECT DISTINCT
	n.idnoticia
    , n.titulo
    , n.capa
    , n.descricao
    , DATE_FORMAT(n.datapub, "%d/%m/%Y") as datapub
    , n.acessos
    , (SELECT COUNT(*) FROM comentario WHERE idnoticia = n.idnoticia AND excluido = 0) as comentarios
    , (SELECT COUNT(*) FROM curtida WHERE idnoticia = n.idnoticia) as curtidas
FROM 
	noticia as n
    JOIN noticiatag as nt ON nt.idnoticia = n.idnoticia
    JOIN tag as t ON t.idtag = nt.idtag
WHERE
    n.ativo = 1
    AND t.descricao like CONCAT('%', @texto, '%')
ORDER BY
	n.datapub DESC

--END#obterpostsportag#

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
    , CASE
		WHEN c.idusuario = @idusuario THEN 1
        ELSE 0 
      END AS ad
    , CASE
		WHEN @idtipousuario = 1 THEN 1
        ELSE 0
	  END as adg
FROM 
	comentario c
    JOIN usuario u ON u.idusuario = c.idusuario
WHERE
    idnoticia = @idnoticia
	AND excluido = 0
ORDER BY 
	c.datacad DESC

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
    t.idtag
	, t.descricao
FROM 
	noticiatag nt
    INNER JOIN tag as t ON t.idtag = nt.idtag
WHERE
	nt.idnoticia = @idnoticia
    AND t.ativo = 1
ORDER BY
	t.descricao

--END#obtertagspost#

--#curtir#

INSERT INTO curtida
    (idnoticia, idusuario)
VALUES
    (@idnoticia, @idusuario)

--END#curtir#

--#descurtir#

DELETE FROM curtida WHERE idnoticia = @idnoticia AND idusuario = @idusuario

--END#descurtir#

--#acesso#

UPDATE 
    noticia
SET
    acessos = @acessos
WHERE
    idnoticia = @idnoticia

--END#acesso#

--#removerComentario#

UPDATE 
    comentario
SET
    excluido = 1
WHERE
    idcomentario = @idcomentario

--END#removerComentario#

--#adicionarComentario#

INSERT INTO  comentario
    (idnoticia, idusuario, texto)
VALUES
    (@idnoticia, @idusuario, @texto)

--END#adicionarComentario#