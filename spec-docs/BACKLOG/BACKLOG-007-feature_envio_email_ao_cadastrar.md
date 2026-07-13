Atue como staff engenner e implemente melhoriaa no sistema.

## backend novo servico de enderecop / cep 

adicione um servico que sera uma camada anticorrupcao ou um facade para busca de ceps
o servico sera responsavel por buscar o cep. 
na v1 pode buscar somente semore o mesmo endereco,. 

### api model 
GET /enderecos/<cep>

### campos
   {
      "cep": "01001-000",
      "logradouro": "Praça da Sé",
      "complemento": "lado ímpar",
      "unidade": "",
      "bairro": "Sé",
      "localidade": "São Paulo",
      "uf": "SP",
      "estado": "São Paulo",
      "regiao": "Sudeste",
      "ibge": "3550308",
      "gia": "1004",
      "ddd": "11",
      "siafi": "7107"
    }

## frontend 

adicionar os campos porem nao deve ser obrigatorio 

"cep": "01001-000",
"logradouro": "Praça da Sé",
"complemento": "lado ímpar",
"unidade": "",
"bairro": "Sé",
"localidade": "São Paulo",
"uf": "SP",
"estado": "São Paulo",

## banco de dados 
- alterar model oda tabela para incluir os novos campos 
- salvar campos 