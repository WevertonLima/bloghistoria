--#obtercategoriasdestaques#

SELECT                  
    descricao
FROM 
    categoria
WHERE
    ativo = 1
    AND destaque = 1
ORDER BY 
    descricao

--END#obtercategoriasdestaques#

--#obtercategorias#

SELECT                  
    descricao
FROM 
    categoria
WHERE
    ativo = 1
ORDER BY 
    descricao

--END#obtercategorias#


--#obtertags#

SELECT                  
    descricao
FROM 
    tag
WHERE
    ativo = 1
ORDER BY 
    descricao

--END#obtertags#

--#obtersobre#

SELECT                  
    descricaoautor
    , descricaoblog
FROM 
    sobre

--END#obtersobre#

