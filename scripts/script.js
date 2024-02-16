document.addEventListener("DOMContentLoaded", () =>{
    const afterMain = document.querySelector('.main');

    fetch('https://jsonplaceholder.typicode.com/todos')
        .then(responce => responce.json())
        .then(json => {
            const todosHtml = showArr(json);
            console.log(json)
            afterMain.insertAdjacentHTML('beforebegin', todosHtml);
        });

    const showArr = (todos) => {
        return todos.map(item => {
            return `
                <div>${item.userID}</div>
                <div>${item.id}</div>
                <div>${item.title}</div>
                <div>${item.completed}</div>
            `;
        }).join('');
    }
})