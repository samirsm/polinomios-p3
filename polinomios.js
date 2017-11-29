// Escreva o código JavaScript que implemente polinômios de uma variável.
// Os testes abaixo, exemplificam como os objetos devem se comportar.
// Observe que se trata de uma implementação *puramente funcional*.

// construção de polinomios (os comments abaixo não são a saída do toString!)

//implementação

function polinomios(){
  
  //Funções auxiliares
  
  function arrayObjsToList(array){
    function iteration(n, ac, i){
      if(n === 0) return ac; 
      else {
        ac[i] = array[n-1].base;
        ac[i+1] = array[n-1].exp;
        return iteration(n-1, ac, i+2); 
      }
    }
    return iteration(array.length, [],0);
  }
  
   function getNormalArray(array) {
    function iteration(n, ac){
      if(n === 0) return ac; 
      else {
        const exp = array[n-1].exp;
        const base = array[n-1].base;
        ac[exp] = typeof(ac[exp])==='object'? {base:ac[exp].base + base, exp} :{base, exp};
        return iteration(n-1, ac); 
      }
    }
    return iteration(array.length, []);
  }
  
  function result(array,x){
    function iteration(n, ac){
      if(n === 0) return ac; 
      else return iteration(n-2, ac + array[n-2]*(Math.pow(x,array[n-1]))); 
    }
    return iteration(array.length, 0);
  }
  
   function getObjValues(array){
    function iteration(n, ac, i){
      if(n===0) return ac;
      else {
        ac[i] = {base: array[n-2], exp:array[n-1]};
        return iteration(n-2,ac,i-1);
      }
    }
    return iteration(array.length, [] ,(array.length/2)-1);
  }
  
  //Funções cobradas
  
  function toString(){
    const array = this.array;
    const n = array.length;
    function iteration(n, ac){
      if (n===0) return ac.trim();
      else  {
        const exp = array[n-1].exp; 
        const base = Math.abs(array[n-1].base)===1? '': Math.abs(array[n-1].base);
        const signal = array[n-1].base>0? '+':'-';
        const finalBase = n==1? (signal==='+'? base: signal+base): 
                            signal + ' ' + `${base}`;
        const term = exp === 0? `${finalBase}`: (exp === 1? `${finalBase}x`: `${finalBase}x${exp}`); 
        return iteration(n-1,  term + ' ' +  ac);
      }
    }
    return iteration(n,"");
  }
  
  function normal(){
    const arrayObjs = getNormalArray(this.array).filter(e => typeof(e) === 'object');
    const list = arrayObjsToList(arrayObjs);
    return polinomio(...list);
  }
  

  function polinomio(...args){
    polinomio.prototipo = polinomio.prototipo || {toString, normal};
    novo = (x) => result(args,x);
    novo.args = args;
    novo.array = getObjValues(args).filter(e => e.base !== 0);
    Object.setPrototypeOf(novo, polinomio.prototipo);
    return  novo;
  } 

  return {polinomio}
}

function iguais(p1,p2){
    return p1.normal().toString() === p2.normal().toString();
}

function soma(p1,p2){
    return polinomio(...p1.args, ...p2.args);
}
  

const polinomio = polinomios().polinomio;


const p1 = polinomio(3, 2); // 3x2
const p2 = polinomio(5, 2, -3, 3, 10, 1, -2, 0); // 5x2 - 3x3 + 10x - 2
const p3 = polinomio(3, 3, 4, 1, -5, 0); // 3x3 + 4x - 5
const p4 = polinomio(1, 2, 2, 2); // x2 + 2x2
const p5 = polinomio(1, 2, -2, 2); // x2 - 2x2
const p6 = polinomio(0, 2, 1, 3); // x3 (mas criado a partir de 0x2 + 1x3)


// toString
console.log(p1.toString());
console.log(p2.toString());
console.log(p3.toString());
console.log(p4.toString());
console.log(p5.toString());
console.log(p6.toString());

// toString
console.log(p1.toString() === '3x2');
console.log(p2.toString() === '5x2 - 3x3 + 10x - 2');
console.log(p3.toString() === '3x3 + 4x - 5');
console.log(p4.toString() === 'x2 + 2x2');
console.log(p5.toString() === 'x2 - 2x2');
console.log(p6.toString() === 'x3');


// normalização
console.log(p1.normal().toString() === '3x2');
console.log(p2.normal().toString() === '-3x3 + 5x2 + 10x - 2');
console.log(p3.normal().toString() === '3x3 + 4x - 5');
console.log(p4.normal().toString() === '3x2');
console.log(p5.normal().toString() === '-x2');
console.log(p6.normal().toString() === 'x3');

// aplicação
console.log(p1(3) === 27); // 3x2 (3) = 3*3^2 == 2*9 == 27
console.log(p1(4) === 48);
console.log(p3(4) === 203);
console.log(p3(p2(2)) === 8283);
console.log(p4(4) === 48);
console.log(p4(3) === 27);

// iguais
console.log(iguais(p1, p1) === true);
console.log(iguais(p1, p4) === true);

// soma
console.log(iguais(soma(p1, p1), polinomio(6, 2)));
console.log(iguais(soma(p1, p3), polinomio(3, 3, 3, 2, 4, 1, -5, 0)));