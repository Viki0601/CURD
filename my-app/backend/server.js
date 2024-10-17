app.use(express.json());


app.post('/items',(req,res)=>{
    const newItem =req.body;
    data.push(newItem)
    res.status(201).json(newItem);
});

// Get all items
app.get('/items',(req,res)=>{
    res.json(data);
});

//Get specific item by id

app.get('/items/:id',(req,res)=>{
    const id= parseInt(req.params.id);
    const item =data.find((item) => item.id === id);
    if (!item){
        res.status(404).json({error:'item not found'});
    }else {
        res.json(item);
    }
});

// Update put an item by id
app.put('items/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const Updateitem=req.body;
    const index = data.findIndex((item)=> item.id === id);
    if (index === -1){
        res.status(404).json({error:'Item not found'});
    }else{
        data[index] = { ...data[index], ...updatedItem};
        res.json(data[index]);
    }
});

// delete an item by id
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      const deletedItem = data.splice(index, 1);
      res.json(deletedItem[0]);
    }
});
