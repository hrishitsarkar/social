{

    //method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type : 'post',
                //post creation route
                url : '/posts/create',
                //convert into JSON
                data : newPostForm.serialize(),
                success : function(data){
                    let newPost = newPostDom(data.data.post);
                    $('.post-lists > ul').prepend(newPost);
                    deletePost($(' .delete-post-button',newPost));
                    console.log(data);
                },
                error : function(error){
                    console.log(error.responseText);
                }

            });
        });
    }

    //method to create post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${ post._id}">
        <h6><span>${ post.user.name }</span> posted this ,</h6>

        ${ post.content }
        
        <div id="delete">
            <a class="delete-post-button" href="/posts/destroy/${ post.id }"><button id="delete-btn">Delete Post</button></a>
        </div>
    
    
        <div id="comment-container">
           <form action="/comments/create" method="post">
            <textarea name="content" id="comment-txt" cols="60" rows="2" placeholder="Write a comment" required></textarea>
            <input type="hidden" name="post" value=" ${post._id }">
            <input type="submit" id="comment-btn" value="Post Comment">
           </form>
        </div>
         <h1 id="comments-head">Comments</h1>
        <div class="post-comments-list">
            
            <ul id="post-comments-${ post._id }">
    
            </ul>
        </div>
    </li>
    `)
    }
    //method to delete a post from dom

    let deletePost = function(deleteLink){
        $(deleteLink).click((e)=>{
            e.preventDefault();

            $.ajax({
                type : 'get',
                url : $(deleteLink).prop('href'),
                success :  function(data){
                    $(`#post-${data.data.post_id}`).remove();
                },
                error : function(error){
                    console.log(error.responseText);
                }
            })
        })
    } 

    createPost();
}