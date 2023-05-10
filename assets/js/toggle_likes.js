

// class ToggleLike{
    
//     constructor(toggleElement){
//         this.toggler = toggleElement;
//         this.toggleLike();
//     }

//     toggleLike(){
//         console.log(this.toggler);
//         $(this.toggler).click(function(e){
//             e.preventDefault();
//             let self = this;
//             console.log('inside click',this);
//             $.ajax({
//                 type : 'post',
//                 url : $(self).attr('href'),

//             }).done(function(data){
//                 let likesCount = parseInt($(self).attr('data-likes'));
//                 console.log(likesCount);
//                 console.log(data);

//                 if(data.data.deleted == true){
//                     likesCount -= 1;
                    
//                 }else{
//                     likesCount += 1;
                    
//                 }
//                 console.log(likesCount);
//                 $(self).attr('data-likes',likesCount);
//                 $(self).html(`${likesCount} <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Facebook_Thumb_icon.svg/1200px-Facebook_Thumb_icon.svg.png" alt="likes">`);
//             })
//             .fail(function(error){
//                 console.log('error in completing request')
//             })

            
//         })
//     }
// }
// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            // this is a new way of writing ajax which you might've studied, 
            //it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = isNaN(parseInt($(self).attr('data-likes'))) ? 0 : parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                if (data.data.deleted == true){
                    likesCount -= 1;
                    
                }else{
                    likesCount += 1;
                }


                $(self).attr('data-likes', likesCount);
                $(self).html(`${likesCount}<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Facebook_Thumb_icon.svg/1200px-Facebook_Thumb_icon.svg.png" alt="likes">`);

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}