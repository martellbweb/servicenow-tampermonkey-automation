# ServiceNow Queue Automator 🚀

Uma ferramenta automatizada de monitoramento e alertas do lado do cliente (client-side), o script lê a tela (o HTML/DOM) que o servidor da ServiceNow já enviou para o seu computador, escrita em JavaScript puro e implantada como um Userscript de navegador via Tampermonkey. Ela analisa dinamicamente os ambientes DOM do ServiceNow para eliminar tarefas repetitivas de monitoramento e acelerar a triagem de incidentes.

## 🎯 O Problema Operacional
Em ecossistemas de suporte corporativo, os analistas executam constantemente atualizações manuais do navegador para detectar incidentes de alta prioridade. Essa sobrecarga manual cria latência operacional e fadiga visual.

## 💡 A Solução
Este script executa programaticamente varreduras leves em segundo plano nos componentes DOM renderizados e Shadow DOM. Ele cria imediatamente sobreposições estruturais de alta visibilidade e alertas sonoros quando um incidente alvo aparece.

![Demonstração do Alerta Visual](src/assets/alerta-tela.jpg.jpg)
## ✨ Principais Competências Técnicas
- **Navegação no Shadow DOM:** Itera por componentes web encapsulados.
- **Avaliação de Estado Assíncrona:** Loops de polling com estado.

- **Manipulação Dinâmica do DOM:** Injeção programática de elementos da interface do usuário.

## 🛠️ Tecnologias
- JavaScript (ES6+)
- Tampermonkey
- Manipulação do DOM
