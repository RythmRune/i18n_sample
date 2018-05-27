module.exports.index_init = (req, res) => {
    let simple_phrase = res.__('Hello');

    let zero_apple =  res.__n('%s apple', 0);
    let single_apple =  res.__n('%s apple', 1);
    let plurals_apple =  res.__n('%s apple', 5);

    let names = ["John", "Joe"];
    let sentance1 = res.__mf('Hello, {name}', { name: names[0] },);
    let sentance2 = res.__mf('Hello, {name}', { name: names[1] },);

    res.render('index', { 
        simple_phrase: simple_phrase,
        zero_apple: zero_apple,
        single_apple: single_apple,
        plurals_apple: plurals_apple,
        sentance1: sentance1,
        sentance2: sentance2,
    });
}