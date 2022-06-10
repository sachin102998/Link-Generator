const uploadBtn=document.querySelector('#upload-btn');
const uploadBtn2=document.querySelector('#upload-btn2');
const uploadBtn3=document.querySelector('#upload-btn3');
const inpBox=document.querySelector('#inp-box')
const overlay=document.querySelector('.overlay');
const underlay=document.querySelector('.underlay'); 
const croppped=document.querySelector('.cropped');
const cropppedU=document.querySelector('.cropped-upper');
const dropZone=document.querySelector('#drop-zone');
const linker=document.querySelector('.get-link');
const modalCloseTrigger = document.querySelector('.popup-modal__close');
const bodyBlackout = document.querySelector('.body-blackout');
const popupModal=document.querySelector('.popup-modal');
const conta=document.querySelector('.conta');
const rel=document.querySelector('.rel'); 
var resize,count,file;
var isCropped=false;

uploadBtn.addEventListener("click",function() {
    console.log("button 1 pressed");
    inpBox.click();
})

inpBox.addEventListener('change',urlExtractor);

uploadBtn2.addEventListener("click",function() {
    console.log("button 2 pressed"); 
    if(gate===true && count==0) {
        count++;
        resize = new Croppie(croppped, {
            viewport: { 
              width: 200, 
              height: 200,
              type: 'square'
            },
            boundary: { 
              width: 350, 
              height: 300 
            }, 
            enableOrientation: true
          });
    }else if(gate==true && count==1) {
        count++;
        isCropped=true;
        resize.result('base64').then(function(dataImg) {  
             file=dataURItoBlob(dataImg); 

            cropppedU.src=dataImg; 
            croppped.classList.remove('cropped-show');
            croppped.src='#';
            cropppedU.classList.add('cropped-show');
            overlay.appendChild(croppped);
            croppped.classList.remove('cr-original-image');
            document.querySelector('.croppie-container').remove();
     })
        
     }  

})

uploadBtn3.addEventListener("click",function() { 
     if(file!==undefined) {
        conta.classList.add('shower');
        const formData=new FormData();
        formData.append("image",file);
        fetch('https://api.imgur.com/3/image/',{
        method:"POST",
        headers:{
            Authorization:"CLIENT-ID b865730ae641337"
        },
        body:formData
        }).then(data=>data.json())
        .then(data=> {
            conta.classList.remove('shower');
            popupModal.classList.add('is--visible');
            bodyBlackout.classList.add('is-blacked-out');
            linker.href=data.data.link; 
    })
    }
})

modalCloseTrigger.addEventListener("click",function() { 
    popupModal.classList.remove('is--visible')
    bodyBlackout.classList.remove('is-blacked-out');
})



function urlExtractor(e) {  
    if(e.type==="change") {
        file = e.currentTarget.files[0]; 
    }else {
        file=e.dataTransfer.files[0];
    } 
    paster(file);
}

function paster(x) {
    var reader=new FileReader(); 
    reader.onload=function() {  
        underlay.style.display="none";
        croppped.src=reader.result;
        cropppedU.classList.remove('cropped-show');
        croppped.classList.add('cropped-show'); 
        gate=true;
        count=0;
    } 
    reader.readAsDataURL(x); 
}
 
 

var dragdrop = {
	init : function( elem ){
		elem.setAttribute('ondrop', 'dragdrop.drop(event)');
        elem.setAttribute('ondragover', 'dragdrop.drag(event)' );
        elem.setAttribute('ondragleave', 'dragdrop.leave(event)' );
        elem.setAttribute('onmouseover', 'dragdrop.hoverin(event)' );
        elem.setAttribute('onmouseleave', 'dragdrop.hoverout(event)' );
	},
	drop : function(e){ 
		e.preventDefault();
		var file = e.dataTransfer.files[0];
		urlExtractor(e);
	},
	drag : function(e){ 
        e.path[0].style.backgroundColor="#ecf0f5";
        e.path[0].style.transform="scale(1.01)"
		e.preventDefault();
    },
    leave:function(e) { 
        e.path[0].style.backgroundColor="#fff";
        e.path[0].style.transform="scale(1)"
        e.preventDefault();
    },
    hoverin:function(e) { 
        if(e.path[0]===overlay) {
            e.path[0].style.transform="scale(1.01)";
            e.path[0].style.backgroundColor="#ecf0f5";
            e.path[0].style.cursor="pointer";
        }
    },
    hoverout:function(e) {
        e.path[0].style.transform="scale(1)";
        e.path[0].style.backgroundColor="transparent";
    }
    
};


dragdrop.init(overlay); 


function dataURItoBlob(dataURI) { 
    var byteString = atob(dataURI.split(',')[1]); 
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; 
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
 
    return new Blob([ab], {type: mimeString});


}