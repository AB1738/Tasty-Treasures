const btn=document.querySelector('.show-macro-input')
const btn2=document.querySelector('.show-macro-input2')
const macros=document.querySelector('.macros')
const minInput=document.querySelectorAll('.min')
const maxInput=document.querySelectorAll('.max')
const submitBtn=document.querySelector('.form-submit-btn')
let counter=0

const btnArray=[btn,btn2]
btnArray.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        counter++
        e.preventDefault()
        if(counter%2==1){
        macros.style.display='inline'
        btn2.style.display='block'
        btn.style=''
        }else if(counter%2==0){
            macros.style.display='none'
            btn2.style.display='none'
    
        }
    })
})



    // window.addEventListener('click',(e)=>{
    //     for(let i=0;i<maxInput.length;i++){
    //         if(e.target.matches('.container')){
    //             console.log('working')
    //             if(macros.style.display=='inline'){
    //             macros.style.display==='none'
    //         }
    //         }
    //     }
    //     // if(!e.target.matches('.macros')){
    //     //     console.log('not clicking the plus button')
    //     //     if(macros.style.display==='inline'){
    //     //         macros.style.display==='none'
    //     //     }
    //     // }
    // })

