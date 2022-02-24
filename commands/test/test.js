module.exports={
    name: 'test',
    alias:['prova', 'funziona'],
    onlyStaff:true,
    execute(message){
        message.channel.send('test');
    }
}