class Users{
    constructor (){
        this.users=[];
    }

    addUser(id,name,room){
        let user={id,name,room};
        this.users.push(user);
        return user;
    }

    removeUser(id){
        let user = this.getUser(id);

        if(user){
            this.users=this.users.filter((user)=>user.id!==id);
        }

        return user;
    }

    getUser(id){
        return this.users.filter((user)=>user.id===id)[0];
    }

    getUsersList(room){
        //Crea array con objetos que cumplen la funcion de la iteracion
        let users=this.users.filter((user)=>user.room===room);
        let userNames=users.map((user)=>user.name);

        return userNames;
    }
}

module.exports={Users};

