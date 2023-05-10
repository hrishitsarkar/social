// class PostComments{


//     constructor(postId){
//          this.postId = postId;
//          this.postContainer = $(`#post-${ postId}`);
//          this.newCommentForm = $(`#post-${ postId }-comments-form`);
//          this.createComment(postId);
//          let self = this;
//          console.log('$$',this)
//          console.log(postId)
//          $(' .del-cmnt',this.postContainer).each(function(){
//             console.log('this',$(this));
//             self.deleteComment($(this));
//          })
//     }

//      createComment (postId) {
//                 let pSelf = this;
//                 console.log('inside create Comment')


//                 this.newCommentForm.submit(function(e){
//                     e.preventDefault();
//                     console.log('inside submit')
//                     let self = this;
//                     console.log('after preventing');

//                     $.ajax({
//                         type: 'post',
//                         url: '/comments/create',
//                         data: $(self).serialize(),
//                         success: function (data) {
//                             console.log(data)
//                             let newComment = pSelf.newCommentDom(data.data.comment);
//                             $(`#post-comments-${postId}`).prepend(newComment);

//                             pSelf.deleteComment($('.del-cmnt',newComment));
//                             new ToggleLike(' .toggle-like-btn',newComment);

//                             new Noty({
//                                 theme: 'mint',
//                                 text: "You Commented",
//                                 type: 'alert',
//                                 layout: "topRight",
//                                 timeout: 1500

//                             }).show();

//                         },
//                         error: function (error) {
//                             console.log(error.responseText);
//                         }
//                     })
//                 })

//             }
//              newCommentDom (comment) {
//                 return $(`<li>
//                 <h3>${ comment.user.name }</h3>

//                 <p>${comment.content}</p>
//                 <a class="toggle-like-btn" href="/likes/toggle?id=${comment._id}&type=Comment" data-likes = '0'>0<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Facebook_Thumb_icon.svg/1200px-Facebook_Thumb_icon.svg.png" alt="likes"></a>

//                    <p><a class="del-cmnt" href="/comments/destroy/${comment._id}">Delete</a></p>

//              </li>`)

//             }

//              deleteComment(deleteLink) {
//                 $(deleteLink).click(function(e) {
//                     e.preventDefault();
//                     console.log('after preventing comment delete');
//                     console.log($(deleteLink).prop('href'));

//                     $.ajax({
//                         type: 'get',
//                         url: $(deleteLink).prop('href'),
//                         success: function (data) {
//                             console.log(data);
//                             $(`#comment-${data.data.comment._id}`).remove();
//                             new Noty({
//                                 theme: 'mint',
//                                 text: "Comment Deleted",
//                                 type: 'alert',
//                                 layout: "topRight",
//                                 timeout: 1500

//                             }).show();
//                         },
//                         error: function (error) {
//                             console.log(error.responseText);
//                         }
//                     })
//                 })
//             }


//     }
// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments {
	//constructor is used to initialize the instance of the class
	//when ever a new instance is created
	//object is the instance of the class
	//new object is created through the constructor function
	constructor(postId) {

		this.postId = postId;
		// console.lof(postId);
		this.postContainer = $(`#post-${postId}`);
		// console.log(postContainer);
		// post-<%= pt._id %>-comment-form
		this.newCommentForm = $(`#post-${post._id}-comments-form`);

		//call the function for the creating the comment in the ajax form
		this.createComment(postId);

		let self = this;
		// console.log(this);
		//call all the existing comments
		//for deleting the comment through the ajax
		$(" .del-cmnt", this.postContainer).each(function () {
			self.deleteComment($(this));
		});
	}

	createComment(postId) {
		//create the comment through the ajax dynamic comment

		let pSelf = this;
		this.newCommentForm.submit(function(e) {
			e.preventDefault(); //so that refreshing the page won't happen
			console.log("inside the comment submit");
			let cSelf = this;

			//now ajax call
			$.ajax({
				type: "POST",
				url: "/comments/create",
				data: $(cSelf).serialize(),
				success: function (data) {
					let newComment = pSelf.newCommentDom(data.data.comments);
					$(`#post-comments-${postId}`).prepend(newComment);
					pSelf.deleteComment($('.del-cmnt', newComment));

					// CHANGE :: enable the functionality of the toggle like button
					// on the new comment
					new ToggleLike($(' .toggle-like-button', newComment));

					new Noty({
						theme: 'relax',
						text: "Comment published!",
						type: 'success',
						layout: 'topRight',
						timeout: 1500

					}).show();

				}, error: function (error) {
					console.log(error.responseText);
				}
			});
		});
	}

	//newCommentDom called
	newCommentDom(comment) {

		//to delete comment link and also id to the comment li
		return $(`<li id="comment-${comment._id}">
		<h3>${comment.user.name}</h3>
		 <p>${comment.content}</p>
		 
		   <a  class="toggle-like-btn" href="/likes/toggle?id=${comment._id}&type=Comment" data-likes = "${comment.likes.length}">${comment.likes.length}<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Facebook_Thumb_icon.svg/1200px-Facebook_Thumb_icon.svg.png" alt="likes"></a>
		   
			   ${comment.likes.length}
			   
		 
			<p><a class="del-cmnt" href="/comments/destroy/${comment.id}">Delete</a></p>
			
	  </li>`);
	}

	// deleteComment call
	deleteComment(deleteLink) {
		$(deleteLink).click(function (e) {
			e.preventDefault();

			$.ajax({
				type: "GET",
				url: $(deleteLink).prop("href"),
				success: function (data) {
					$(`#comment-${data.data.comment._id}`).remove();

					new Noty({
						theme: "relax",
						text: "Comment Deleted",
						type: "success",
						layout: "topRight",
						timeout: 1500,
					}).show();
				},
				error: function (error) {
					console.log(error.responseText);
				},
			});
		});
	}
}
