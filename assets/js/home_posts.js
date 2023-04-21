{

    //method to submit the form data for new post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function (e) {
            e.preventDefault();
            $.ajax({
                type: 'post',
                //post creation route
                url: '/posts/create',
                //convert into JSON
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('.post-lists > ul').prepend(newPost);


                    console.log('link', $('.delete-post-button', newPost).prop('href'))

                    deletePost($('.delete-post-button', newPost));
                    console.log(data);
                    new Noty({
                        theme: 'mint',
                        text: "Post Created",
                        type: 'alert',
                        layout: "topRight",
                        timeout: 1500

                    }).show();
                },
                error: function (error) {
                    console.log(error.responseText);
                    new Noty({
                        theme: 'mint',
                        text: error.responseText,
                        type: 'alert',
                        layout: "topCenter",
                        timeout: 1500

                    }).show();
                }

            });
        });
    }

    //method to create post in DOM
    let newPostDom = function (post) {
        return $(`<li id="post-${post._id}">
        <h6><span>${post.user.name}</span> posted this ,</h6>

        ${post.content}
        
        <div id="delete-${post._id}" class="delete">
            <a class="delete-post-button" href="/posts/destroy/${post._id}"><button id="delete-btn">Delete Post</button></a>
        </div>
    
    
        <div id="comment-container">
           <form action="/comments/create" method="post">
            <textarea name="content" id="comment-txt" cols="60" rows="2" placeholder="Write a comment" required></textarea>
            <input type="hidden" name="post" value=" ${post._id}">
            <input type="submit" id="comment-btn" value="Post Comment">
           </form>
        </div>
         <h1 id="comments-head">Comments</h1>
        <div class="post-comments-list">
            
            <ul id="post-comments-${post._id}">
    
            </ul>
        </div>
    </li>
    `)
    }
    //method to delete a post from dom

    let deletePost = function (deleteLink) {
        $(deleteLink).click((e) => {
            e.preventDefault();
            console.log($(deleteLink).prop('href'));

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'semanticui',
                        text: "Post Deleted",
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
    let convertToAjax = function () {
         $('#posts-list-container>ul>li').each(function () {
            console.log(this)
            let self = $(this);
            console.log('self',self);
            let deleteButton = $(' .delete-post-button', self);
            console.log('del', deleteButton);
            deletePost(deleteButton);

            let postId = self.prop('id').split('-')[1];
            console.log('***',postId);
            new PostComments(postId);


        })
        

    }

    createPost();
    convertToAjax();

}
