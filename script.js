(async () => {
       // Array JSON externo (simulado)
       var imgUrl = "https://www.socialpointgames.com/static/dragoncity/mobile/ui/dragons/HD/thumb_%1_3.png"


       // Exiba a tela de carregamento
       const loader = document.getElementById("loader");
       loader.style.display = "flex";

       // TEXTS
       /*
       var TEXT {
           PT : {
               search : "Pesquisar..."
           },
           EN : {
               search : "Searching..."
           }
       }
       */

       // GET LANGAGYE 
       // Verifique o idioma do usuário
       var LANG = navigator.language || navigator.userLanguage;
       LANG = LANG.startsWith('pt') ? "PT" : "EN"

       // VAR EXTERNAL.JSON DAAT 
       var MAIN_INFO = new Array()
       const INFO = await fetch("./files/INFO.json")
          .then(r => r.json())

       const DATA = await fetch("./files/DATA.json")
          .then(r => r.json())

       const ELEMENTS = await fetch("./files/ELEMENTS.json")
          .then(r => r.json())

       // 
       MAIN_INFO = [...INFO]

       // funcso para regornar ad imagens dos elem tos
       const elemntsTest = ["ti", "f", "el", "m", "wd"];

       function elementsImg(type, arr, size = 4) {
          arr = arr.map(item => {
             item = item.trim()
             var t = '<img src="%1" style="width: %2%;">'
                .replace("%1", `elements_${type}/${item}.png`)
                .replace("%2", size)
             return t;
          })

          return arr.join('\n');
       };


       // Variáveis de controle de paginação
       const isMobile = window.innerWidth <= 768
       const itemsPerPage = isMobile ? 10 : 30
       let currentPage = 1;

       // Função para renderizar uma tabela com base nos dados e página atual


       function renderTable(page) {
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const tableList = document.getElementById('tableList');
          tableList.innerHTML = '';


          const type = "square"
          const size = "35"
          for (let i = startIndex; i < endIndex && i < INFO.length; i++) {
             var item = MAIN_INFO[i];
             var table = document.createElement('table');

             var EL = item.CRITICS.split("|")
                .map(l => l.trim())

             var MS = ELEMENTS
                .filter(l => !EL.includes(l))

             var DR = item.DRAGONS.split("|")
                .map(l => {
                   return DATA.find(x => x.name === l.trim())
                })
                .map(l => {
                   var _img = imgUrl.replace(
                      "%1",
                      l.img_name_mobile
                   )

                   return {
                      img: _img,
                      attr: l.attributes,
                      name: l[LANG]
                   }
                })

             // GET DRAGON INFO 
             table.innerHTML = `
                    <tr id="dragon_names">
                        <td>${DR[0].name}</td>
                        <td>${DR[1].name}</td>
                        <td>${DR[2].name}</td>
                    </tr>
                    <tr>
                        <th id="thumb"; style="text-align: center;">
                              <img src="${DR[0].img}" style="width: ${size}%;">
                        </th>                       
                        <th id="thumb"; style="text-align: center;">
                              <img src="${DR[1].img}" style="width: ${size}%;">
                        </th>
                        <th id="thumb"; style="text-align: center;">
                              <img src="${DR[2].img}" style="width: ${size}%;">
                        </th>

                    </tr>
                    <tr> 
                        <td id="dragon_elements">
                            ${elementsImg("flag", DR[0].attr, "10")}
                        </td>
                        <td id="dragon_elements">
                            ${elementsImg("flag", DR[1].attr, "10")}
                        </td>
                        <td id="dragon_elements">
                            ${elementsImg("flag", DR[2].attr, "10")}
                        </td>
                    </tr>
                    <tr bgcolor="#A5EF50";>
                        <td colspan="3" style="text-align: center;">
                            ${elementsImg(type, EL)}
                        </td>
                    </tr>
                    <tr bgcolor="#EF5B50";>
                        <td colspan="3" style="text-align: center;">
                            ${elementsImg(type, MS)}
                        </td>
                    </tr>
                    <tr id="footer">
                        <td colspan="3";>
                            ${EL.length + " / " + ELEMENTS.length}
                        </td>
                    </tr>
                `;
             tableList.appendChild(table);
          }

          loader.style.display = "none";
       }

       ///)/ 
       const _text = (str) => {
          return String(str)
             .normalize('NFD')
             .replace(/[\u0300-\u036f]/g, "")
             .toLowerCase()
       }

       // Função para atualizar a lista de tabelas com base na pesquisa
       function filterTable() {
          var searchInput = document.getElementById('searchInput').value.toLowerCase();

          if (searchInput.includes(",")) {
             searchInput = searchInput.split(",")
          } else {
             searchInput = new Array(searchInput)
          }

          searchInput = searchInput.map(l => _text(l))

          MAIN_INFO = [...INFO]
          for (var dragonSearch of searchInput) {
             MAIN_INFO = MAIN_INFO.filter(item => {
                var names1 = item[LANG].split("|")
                   .filter(l => l.includes(dragonSearch))

                var names2 = LANG === "PT" ? "EN" : "PT"
                names2 = item[names2].split("|")
                   .filter(l => l.includes(dragonSearch))


                return (names1.length || names2.length)
             })
          }

          currentPage = 1;
          renderTable(currentPage, MAIN_INFO);
          renderPagination(MAIN_INFO.length);
       }


       // ... Seu código anterior ...

       // Função para renderizar a paginação
       function renderPagination(totalItems) {
          const pagination = document.getElementById('pagination');
          pagination.innerHTML = '';

          const totalPages = Math.ceil(totalItems / itemsPerPage);
          const maxVisibleButtons = 6;

          const startPage = Math.max(currentPage - Math.floor(maxVisibleButtons / 2), 1);
          const endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);

          for (let i = startPage; i <= endPage; i++) {
             const button = document.createElement('button');
             button.innerText = i;
             button.classList.add('page-button');
             if (i === currentPage) {
                button.classList.add('active');
             }
             button.addEventListener('click', () => changePage(i));
             pagination.appendChild(button);
          }

          // Adicione botão "Próximo" se necessário
          if (currentPage < totalPages) {
             const nextButton = document.createElement('button');
             nextButton.innerText = '>';
             nextButton.classList.add('page-button');
             nextButton.addEventListener('click', () => changePage(currentPage + 1));
             pagination.appendChild(nextButton);
          }

          // Adicione botão "Anterior" se necessário
          if (currentPage > 1) {
             const prevButton = document.createElement('button');
             prevButton.innerText = '<';
             prevButton.classList.add('page-button');
             prevButton.addEventListener('click', () => changePage(currentPage - 1));
             pagination.insertBefore(prevButton, pagination.firstChild);
          }
       }

       // Função para atualizar a página
       function changePage(pageNumber) {
          currentPage = pageNumber; // Atualiza a página atual
          renderTable(currentPage);
          renderPagination(MAIN_INFO.length);
       }

       // Atualize a página inicial para exibir o número correto de tabelas
       const initialPage = 1;
       renderTable(initialPage);
       renderPagination(MAIN_INFO.length, initialPage);
       document.getElementById('searchInput')
          .addEventListener('input', filterTable)
})()