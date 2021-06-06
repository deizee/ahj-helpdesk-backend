const Koa = require('koa');
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const idGenerator = require('node-unique-id-generator');

app.use(cors());
app.use(koaBody({urlencoded: true, multipart:true}));
app.use(router.routes());
app.use(router.allowedMethods());

const tickets = [{
    id: idGenerator.generateGUID(),
    name: 'Поменять краску в принтере, ком. 404',
    description: 'Принтер HP LJ-1210, картриджи на складе',
    status: false,
    created: Date.now()
},
    {
        id: idGenerator.generateGUID(),
        name: 'Переустановить Windows, PC-Hall24',
        description: '',
        status: false,
        created: Date.now()
    },
    {
        id: idGenerator.generateGUID(),
        name: 'Установить обновление KB-31642dv3875',
        description: 'Вышло критическое обновление для Windows',
        status: false,
        created: Date.now()
    }
];

router.get('/allTickets', ctx => {
    ctx.response.body = tickets;
});

router.get('/ticketById/:id', ctx => {
    const id = ctx.request.params.id;
    ctx.response.body = tickets.find(ticket => ticket.id === id);
});

router.post('/createTicket', ctx => {
    const createData = ctx.request.body;
    const newTicket = {
        id: idGenerator.generateGUID(),
        name: createData.name,
        status: false,
        description: createData.description || '',
        created: Date.now()
    };
    tickets.push(newTicket);
    ctx.response.body = [newTicket];
});

router.delete('/deleteById/:id', ctx => {
    const id = ctx.request.params.id;
    const deleteIdx = tickets.findIndex(ticket => ticket.id === id);
    tickets.splice(deleteIdx, 1);
    ctx.response.body = tickets;
});

router.put('/updateById/:id', ctx => {
    const id = ctx.request.params.id;
    const updateIdx = tickets.findIndex(ticket => ticket.id === id);
    const updateData = ctx.request.body;
    const ticket = {
        ...tickets[updateIdx],
        ...updateData
    }
    tickets.splice(updateIdx, 1);
    tickets.splice(updateIdx, 0, ticket);
    ctx.response.body = tickets;
});

module.exports = app;
