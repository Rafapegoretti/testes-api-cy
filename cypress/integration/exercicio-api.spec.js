/// <reference types="cypress" />

import contract from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.wait(500)
          cy.request('usuarios').then(response => {
               return contract.validateAsync(response.body)
          });
     });

     it('Deve listar usuários cadastrados', () => {
          cy.wait(500)
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response => {
               expect(response.status).to.be.equal(200)
          }));
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          cy.wait(500)
          let data = new Date();
          let dataFormatada = data.toLocaleString().replaceAll(' ', '').replaceAll('/', '').replaceAll(':', '')

          cy.cadastrarUsuario(`Usuario Cadastrado ${dataFormatada}`, `deletado${dataFormatada}@teste.com.br`, 'teste', 'true').then((response => {
               expect(response.body.message).to.be.equal('Cadastro realizado com sucesso')
          }))
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.wait(500)
          cy.cadastrarUsuario("Fulano da Silva", "beltrano@qa.com.br", "teste", "true").then((response => {
               expect(response.body.message).to.be.equal('Este email já está sendo usado')
          }))
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.wait(500)
          let data = new Date();
          let dataFormatada = data.toLocaleString().replaceAll(' ', '').replaceAll('/', '').replaceAll(':', '')

          cy.cadastrarUsuario(`Usuario Editado ${dataFormatada}`, `atualizado${dataFormatada}@teste.com.br`, 'teste', 'true').then(response => {
               let id = response.body._id;
               cy.log(response)
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    body: {
                         "nome": `Usuario Editado ${dataFormatada}`,
                         "email": `atualizado${dataFormatada}@teste.com.br`,
                         "password": "teste",
                         "administrador": "true"
                    }
               }).then(response => {
                    expect(response.body.message).to.be.equal('Registro alterado com sucesso')
               })
          });
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          cy.wait(500)
          let data = new Date();
          let dataFormatada = data.toLocaleString().replaceAll(' ', '').replaceAll('/', '').replaceAll(':', '')

          cy.cadastrarUsuario(`Usuario Deletado ${dataFormatada}`, `deletado${dataFormatada}@testee.com.br`, 'teste', 'true').then(response => {
               let id = response.body._id;
               cy.log(response)
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`
               }).then(response => {
                    cy.log(response)
                    expect(response.body.message).to.be.equal('Registro excluído com sucesso')
               })
          });
     });


});
