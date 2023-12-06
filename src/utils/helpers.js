function generateNoteHTML(note) {
  return `
    <div class="sticky-note" id="note-${note.id}" onclick="onNoteClick(${note.id})">
      <div class="note-header">
        <span class="username">${note.username}</span>
        <span class="timestamp">${note.timestamp}</span>
      </div>
      <div class="note-body">
        <p>${note.text}</p>
      </div>
      <div class="note-reactions">
        <button onclick="sendReaction(1, ${note.id})"> <3 (${note.reaction1})</button>
        <button onclick="sendReaction(2, ${note.id})"> :) (${note.reaction2})</button>
        <button onclick="sendReaction(3, ${note.id})"> :| (${note.reaction3})</button>
        <button onclick="sendReaction(4, ${note.id})"> :( (${note.reaction4})</button>
      </div>
      <div class="comments-container" id="comments-container-${note.id}">
        <!-- Kommentarer vil blive indlæst og vist her -->
      </div>
      <div class="comment-input">
        <input type="text" id="comment-input-${note.id}" placeholder="Skriv en kommentar...">
        <button onclick="sendComment(${note.id})">Send</button>
      </div>
    </div>
  `;
}

module.exports = {
  generateNoteHTML
};

