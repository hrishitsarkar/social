class PostComments{


    constructor(postId){
         this.postId = postId;
         this.postContainer = $(`#post-${ postId}`);
         this.newCommentForm = $(`#post-${ postId }-comments-form`);
         this.createComment(postId);
         let self = this;
         console.log('$$',this)
         console.log(postId)
         $(' .del-cmnt',this.postContainer).each(function(){
            console.log('this',$(this));
            self.deleteComment($(this));
         })
    }

     createComment (postId) {
                let pSelf = this;
                console.log('inside create Comment')
                
        
                this.newCommentForm.submit(function(e){
                    e.preventDefault();
                    console.log('inside submit')
                    let self = this;
                    console.log('after preventing');
        
                    $.ajax({
                        type: 'post',
                        url: '/comments/create',
                        data: $(self).serialize(),
                        success: function (data) {
                            console.log(data)
                            let newComment = pSelf.newCommentDom(data.data.comments);
                            $('.post-comments-list > ul').prepend(newComment);
                            pSelf.deleteComment($(' .del-cmnt',newComment));
                            new Noty({
                                theme: 'mint',
                                text: "You Commented",
                                type: 'alert',
                                layout: "topRight",
                                timeout: 1500
        
                            }).show();
        
                        },
                        error: function (error) {
                            console.log(error.responseText);
                        }
                    })
                })
        
            }
             newCommentDom (comment) {
                return $(`<li>
                <h3>${ comment.user.name }</h3>
                        
                <p>${comment.content}</p>
                
                   <p><a href="/comments/destroy ${comment._id}">Delete</a></p>
                
             </li>`)
        
            }
        
             deleteComment(deleteLink) {
                $(deleteLink).click(function(e) {
                    e.preventDefault();
                    console.log('after preventing comment');
                    console.log($(deleteLink).prop('href'));
        
                    $.ajax({
                        type: 'get',
                        url: $(deleteLink).prop('href'),
                        success: function (data) {
                            console.log(data);
                            $(`#comment-${data.data.comment_id}`).remove();
                            new Noty({
                                theme: 'mint',
                                text: "Comment Deleted",
                                type: 'alert',
                                layout: "topRight",
                                timeout: 1500
        
                            }).show();
                        },
                        error: function (error) {
                            console.log(error.responseText);
                        }
                    })
                })
            }
            
        
    }
// {
//     let createComment = function () {

//         let newCommentForm = $(`#post-${post._id} #comment-container #new-cmnt-form`);
//         console.log(newCommentForm);

//         newCommentForm.submit((e) => {
//             e.preventDefault();
//             console.log('after preventing');

//             $.ajax({
//                 type: 'post',
//                 url: '/comments/create',
//                 data: newCommentForm.serialize(),
//                 success: function (data) {
//                     let newComment = newCommentDom(data.data.comments);
//                     $('.post-comments-list > ul').prepend(newComment);
//                     new Noty({
//                         theme: 'mint',
//                         text: "You Commented",
//                         type: 'alert',
//                         layout: "topRight",
//                         timeout: 1500

//                     }).show();

//                 },
//                 error: function (error) {
//                     console.log(error.responseText);
//                 }
//             })
//         })

//     }
//     let newCommentDom = function (comment) {
//         return $(`<li>
                
//         <p>${comment.content}</p>
        
//            <p><a href="/comments/destroy ${comment.id}">Delete</a></p>
        
//      </li>`)

//     }

//     let deleteComment = function (deleteLink) {
//         $(deleteLink).click((e) => {
//             e.preventDefault();
//             console.log('after preventing comment');

//             $.ajax({
//                 type: 'get',
//                 url: $(deleteLink).prop('href'),
//                 success: function (data) {
//                     $(`#comment-${data.data.comment._id}`).remove();
//                     new Noty({
//                         theme: 'mint',
//                         text: "Comment Deleted",
//                         type: 'alert',
//                         layout: "topRight",
//                         timeout: 1500

//                     }).show();
//                 },
//                 error: function (error) {
//                     console.log(error.responseText);
//                 }
//             })
//         })
//     }
//     createComment();
//     deleteComment($('.del-cmnt'));
// }