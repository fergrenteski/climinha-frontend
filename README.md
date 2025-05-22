
# 🌡️ Climinha

Aplicação web desenvolvida em **Next.js** que exibe a **temperatura atual** e um **histórico gráfico interativo**, com atualização automática a cada 30 segundos.

---

## 🔧 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/)
- [chartjs-plugin-zoom](https://www.chartjs.org/chartjs-plugin-zoom/)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📦 Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/fergrenteski/climinha-frontend
cd climinha
````

2. **Instale as dependências:**

```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> Altere a URL conforme o endereço real da sua API.

4. **Execute o projeto em modo desenvolvimento:**

```bash
npm run dev
# ou
yarn dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 🔁 Funcionamento

* A temperatura é buscada via API a cada **30 segundos**.
* A interface exibe:

    * Temperatura atual com ícone dinâmico colorido.
    * Histórico com gráfico interativo (pan e zoom).
    * Filtros por período: última hora, hoje, última semana, etc.
* O gráfico usa **Chart.js** com plugin de zoom via scroll e pinça.

---

## 📁 Estrutura

```bash
/pages
  └── page.tsx       # Página principal do app (Home)
.env                  # Variáveis de ambiente
```

---

## 🚀 Deploy

Para produção, certifique-se de:

* Configurar o `NEXT_PUBLIC_API_URL` com a URL pública da sua API.
* Rodar:

```bash
npm run build
npm start
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se livre para abrir **issues**, enviar **pull requests** ou sugerir melhorias.

---

## 📄 Licença

MIT
