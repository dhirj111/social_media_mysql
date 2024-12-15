document.addEventListener("DOMContentLoaded", () => {
  fetchPosts();

  // Expose functions to global scope
  window.submitPost = submitPost;
  window.submitComment = submitComment;
  window.toggleCommentSection = toggleCommentSection;

  function submitPost() {
    const imageLink = document.getElementById('imageLink').value;
    const imageCaption = document.getElementById('imageCaption').value;

    axios.post('http://localhost:7000/postdetails', {
      imageLink: imageLink,
      imageCaption: imageCaption
    })
      .then(response => {
        console.log('Post submitted successfully:', response.data);
        fetchPosts();
        document.getElementById('imageLink').value = '';
        document.getElementById('imageCaption').value = '';
      })
      .catch(error => {
        console.error('Error submitting post:', error);
        alert('Failed to submit post');
      });
  }

  function fetchPosts() {
    axios.get('http://localhost:7000/posts')
      .then(response => {
        console.log("checking is it reached to then of fetch")
        displayPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }

  function displayPosts(posts) {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.innerHTML = `
        <img src="${post.imageLink}" alt="${post.imageCaption}" style="max-width: 100%;">
        <p>${post.imageCaption}</p>
        <button onclick="toggleCommentSection(this, ${post.id})">Comment</button>
        <div class="comment-section" style="display: none;">
          <input type="text" id="commentInput${post.id}" placeholder="Your Comment">
          <button onclick="submitComment(this, ${post.id})">Submit Comment</button>
          <div class="comments">
            ${renderComments(post.comments || [])}
          </div>
        </div>
      `;
      postsContainer.appendChild(postElement);
    });
  }

  function toggleCommentSection(button, postId) {
    const commentSection = button.nextElementSibling;
    commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
  }

  function submitComment(button, postId) {
    const commentInput = document.getElementById(`commentInput${postId}`);
    const commentText = commentInput.value;

    if (!commentText.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    axios.post('http://localhost:7000/comments', {
      postId: postId,
      comment: commentText
    })
      .then(response => {
        console.log('Comment submitted successfully:', response.data);
        fetchPosts();
        commentInput.value = '';
      })
      .catch(error => {
        console.error('Error submitting comment:', error);
        alert('Failed to submit comment');
      });
  }

  function renderComments(comments) {
    let result = [];
    for (let i = 0; i < comments.length; i++) {
      result.push(`<div>Anonymous: ${comments[i].text}</div>`);
    }
    return result.join('');
  }
});