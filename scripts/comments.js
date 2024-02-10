const template = document.createElement("template");
template.innerHTML = `
  <style>
  :host {
    display: block;
    margin-bottom: 10px;
  }
  .comment {
    padding: 1rem;
    border-radius: 1rem;
    background: var(--light-secondary);
  }
  .author {
      font-weight: bold;
      color: var(--content-primary);
      display: block;
      margin-bottom: 0.5rem;
  }
  .text {
      color: var(--content-secondary);
      line-height: 1.5;
  }
    
    .reply-form input {
      width: 100%;
      padding: 0.5rem;
      border-radius: 10px;
      border: 1px solid var(--border-color);
      font-family: inherit;
    }
    
    .reply-form button {
      padding: 0.5rem;
      border-radius: 10px;
      border: none;
      background: var(--accent-primary);
      color: var(--light-primary);
      cursor: pointer;
      font-family: inherit;
    }
    
    .reply-form button:hover {
      background: var(--accent-dark);
    }
    
    button.reply {
      background: none;
      color: var(--accent-primary);
      border: none;
      cursor: pointer;
      font-family: inherit;
    }
    
    button.reply:hover {
      text-decoration: underline;
    }
    
    form.reply-form {
      display: none;
      margin-top: 0.5rem;
      gap: 0.5rem;
    }
    
    .comments-container {
      padding-left: 1rem;
      border-left: 2px solid var(--light-secondary);
      margin-top: 0.5rem;
    }
  </style>
  <div class="comment">
    <span class="author"></span>
    <p class="text"></p>
    <button class="reply">Reply</button>
    <form class="reply-form">
      <input id="reply-text" name="reply" required placeholder="Your Comment"></input>
      <button type="submit"><img src="assets/icons/paperplane.svg" class="send-comment-img"></button>
    </form>
    </div>
    <div class="comments-container"></div>
  
`;

class CommentComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );

    this.authorElement = this.shadowRoot.querySelector(".author");
    this.textElement = this.shadowRoot.querySelector(".text");
    this.replyButton = this.shadowRoot.querySelector(".reply");
    this.replyForm = this.shadowRoot.querySelector(".reply-form");
    this.commentsContainer = this.shadowRoot.querySelector(
      ".comments-container"
    );
  }

  connectedCallback() {
    this.authorElement.textContent = this.getAttribute("author");
    this.textElement.textContent = this.getAttribute("text");

    this.replyButton.addEventListener("click", () => {
      this.replyForm.style.display = "flex";
      this.replyButton.hidden = true;
    });

    this.replyForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const replyText = this.replyForm.querySelector("#reply-text").value;
      addComment(replyText, this.commentsContainer);
      this.replyForm.style.display = "none";
      this.replyForm.reset();
      this.replyButton.hidden = false;
    });
  }
}

window.customElements.define("comment-component", CommentComponent);

function generateRandomUserName() {
  const randomNumber = Math.floor(Math.random() * 10000);
  return `User${randomNumber.toString().padStart(4, "0")}`;
}

function addComment(text, container) {
  const commentAuthor = generateRandomUserName();
  const comment = document.createElement("comment-component");
  comment.setAttribute("author", commentAuthor);
  comment.setAttribute("text", text);
  container.appendChild(comment);
}

document.querySelector(".post").addEventListener("submit", function (event) {
  event.preventDefault();

  const text = document.getElementById("comment-text").value;

  addComment(text, document.querySelector(".post .comments-container"));

  document.getElementById("comment-text").value = "";
});

addComment("Hello!", document.querySelector(".post .comments-container"));
