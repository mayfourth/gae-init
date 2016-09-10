/*
    Copyright 2004 Steven Alyari <ossix@ossix.net>. All rights reserved.
    Except for commify function.  See copyright notice in commify function below.

    This file is part of Mortgage & Loan Calculator.

    Mortgage & Loan Calculator is free software; you can redistribute it
    and/or modify it under the terms of the GNU General Public License as
    published by the Free Software Foundation; either version 2 of the License,
    or (at your option) any later version.

    Mortgage & Loan Calculator is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Mortgage & Loan Calculator; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/

function isPUMonth( ) {
	var PU = document.form.PU;
	if (PU[0].checked==true) {
		return 1;
	}
	else {
		return 0;
	}
}

function isBPUMonth( ) {
	var BPU = document.form.BPU;
	if (BPU[0].checked==true) {
		return 1;
	}
	else {
		return 0;
	}
}

function getBaloonAmount( ) {
	/* 

		B: baloon amount	

   		A: monthly payment
		P: loan amount
		i: interest
		n: loan period
		b: baloon months
		PU: period unit: n is Y or M

		j : current month
		LP: remaining loan amount
		PP: loan amount paid this month
		II: interest paid this month
		Nn: months remaining
		sd: start date of loan
		py: payments per year

	*/
	if (checkForMissingData(['A','P','i','n'])) { return; }
	var A,P,i,n;
	var j,LP,PP,II,Nn,sd,py,B;
	f = document.form;
	A = Number(f.A.value);
	P = Number(f.P.value);
	i = Number(f.i.value);
	n = Number(f.n.value);
	b = Number(f.b.value);
	LP = P;
	Nn = n;
	if (!isBPUMonth( )) {
		b = b*12;
	}
	sd = new Date( );
	py = 12;
	for(j=1;j<=b;j++){
		sd.setMonth(sd.getMonth()+1);
		II=LP*i/py/100;
		LP+=II;
		PP=A-II;
		LP-=A;
	}
	B = LP;
	return B;
}

function amortize( ) {
	/* 
		M: selected month
		Y: selected year

   		A: monthly payment
		P: loan amount
		i: interest
		n: loan period
		b: baloon start month 

		j : current month
		LP: remaining loan amount
		PP: loan amount paid this month
		II: interest paid this month
		Nn: months remaining
		sd: start date of loan
		py: payments per year

	*/
	if (checkForMissingData(['A','P','i','n'])) { return; }
	var as=window.open('loo', 'noo' ,'scrollbars=yes,top=100,left=300,width=550,height=450');
	var A,P,i,n,b;
	var j,LP,PP,II,Nn,sd,py;
	var txt = '';
	f = document.form;
	M = Number(f.M.value);
	Y = Number(f.Y.value);
	A = Number(f.A.value);
	P = Number(f.P.value);
	i = Number(f.i.value);
	n = Number(f.n.value);
	b = Number(f.b.value);
	LP = P;
	if (!isBPUMonth( )) {
		b = b*12;
	}
	if (!isPUMonth( )) {
		n = n*12;	
	}
	if (b) {
		Nn = b;
	}
	else {
		Nn = n;
	}
	sd = new Date(Y,M,0,0,0,0,0);
	py = 12;
	txt+='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"\n 	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">\n <head>\n <title>Mortgage Calculator</title>\n <link rel="stylesheet" type="text/css" href="style.css" /> </head> <body><form>';
	txt+='<div class="mainContainer" id="mainContainer"><div class="mainTitle" id="mainTitle">Mortgage Amortization</div><div>';
	txt+='<table>';
	txt+='<tr><td>Month</td><td>Date</td><td>Payment</td><td>Interest</td><td>Principal</td><td>Balance</td></tr>';
	var m;	
	for(j=1;j<=Nn;j++){
		sd.setMonth(sd.getMonth()+1);
		II=LP*i/py/100;
		LP+=II;
		PP=A-II;
		LP-=A;
		m = sd.getMonth( );
		if (!m) {
			m = 12;
		}
		txt+='<tr>';
		txt+='<td>'+j+"</td>";
		txt+='<td>'+(m)+'/'+(sd.getFullYear( ))+'</td>';
		txt+='<td>'+convertVariableToMoney(A)+'</td>';
		txt+='<td>'+convertVariableToMoney(II)+'</td>';
		txt+='<td>'+convertVariableToMoney(PP)+'</td>';
		txt+='<td>'+convertVariableToMoney(LP)+'</td></tr>';
		as.document.write(txt + "\n");
		txt="";
	}
	txt+='</table>';
	txt+='</div><div id="closeWindowButton"><input type="button" value="Close the Window" onClick="self.close()"></div></div></form></body></html>';
	as.document.write(txt);
	as.document.close();
}

function convertVariablesToIntegers( ) {
	f = document.form;
	f.P.value=f.P.value.replace(/[^\d\.]/g,"");
	f.i.value=f.i.value.replace(/[^\d\.]/g,"");
	f.n.value=f.n.value.replace(/[^\d\.]/g,"");
	f.A.value=f.A.value.replace(/[^\d\.]/g,"");
	f.F.value=f.F.value.replace(/[^\d\.]/g,"");
	f.b.value=f.b.value.replace(/[^\d\.]/g,"");
}

function checkForMissingData(inputs) {
	for (var i=0;i<inputs.length;i++) {
		input = inputs[i];
		if (document.form[input].value) {
			continue;
		}
		else {
			setMissingDataError( );
			return 1;
		}
	}
	unsetMissingDataError( );
	return 0;
}

function checkForPaymentLessThanPresentValue( ) {
	/* 
   		A: monthly payment
		P: loan amount
	*/
	var A, P;
	f = document.form;
	A = f.A.value;
	P = f.P.value;
	if (Number(A) > Number(P)) {
		setPaymentLessThanPresentValueError( );
		return 0;
	}
	else {
		unsetPaymentLessThanPresentValueError( );
		return 1;
	}
}

function setMissingDataError( ) {
	e = document.getElementById('errorBox');
	c = document.getElementById('requiredInputMissingError');
	e.style.display	= 'block';
	c.style.display = 'block';
}

function setPaymentLessThanPresentValueError( ) {
	e = document.getElementById('errorBox');
	c = document.getElementById('paymentLessThanPresentValueError');
	e.style.display	= 'block';
	c.style.display = 'block';
}

function unsetMissingDataError( ) {
	e = document.getElementById('errorBox');
	c = document.getElementById('requiredInputMissingError');
	e.style.display	= 'none';
	c.style.display = 'none';
}

function unsetPaymentLessThanPresentValueError( ) {
	e = document.getElementById('errorBox');
	c = document.getElementById('paymentLessThanPresentValueError');
	e.style.display	= 'none';
	c.style.display = 'none';
}

function setResults( ) {
	/* 
   		RA,A: monthly payment 
		RP,P: loan amount
		Ri,i: interest
		Rn,n: loan period
		RF,F: future value
		RI: interest amount
		RT: total amount
		B: baloon amount
	*/
	f = document.form;
	f.RA.value = convertVariableToMoney(f.A.value);
	f.RP.value = convertVariableToMoney(f.P.value);
	f.Ri.value = round(f.i.value) + '%';
	var unit;
	if (isPUMonth( )) {
		unit = "months";
	}
	else {
		unit = "years";
	}
	f.Rn.value = round(f.n.value) + " " + unit;
	f.RF.value = convertVariableToMoney(f.F.value);
	var A,P,r,RI,RT,B;
	A = f.A.value;
	P = f.P.value;
	n = f.n.value;
	b = f.b.value;
	if (!isPUMonth( )) {
		n = n*12;	
	}
	if (b) {
		B = getBaloonAmount( );
		RT = A * b + B;
	}
	else {
		B = Number(0.00);
		RT = A * n;
	}
	RI = RT - P;
	f.B.value = convertVariableToMoney(B);
	f.RI.value = convertVariableToMoney(RI);
	f.RT.value = convertVariableToMoney(RT);
}


function commify(variable) {
	/*
		Commify function not copyright Steven Alyari.  Instead:

		This JavaScript takes an input number and adds commas in the proper places.
		As needed by its original purpose, also adds a dollar.
		Copyright 1998, David Turley <dturley@pobox.com>
		Feel free to use and build on this code as long as you include this notice.
		Last Modified March 3, 1998 

		Newly revised by Steven Alyari: 2004
	*/
	var Num = String(variable);
	var newNum = "";
	var newNum2 = "";
	var count = 0;

	//check for decimal number
	if (Num.indexOf('.') != -1){ //number ends with a decimal point
	if (Num.indexOf('.') == Num.length-1){
		Num += "00";
	}
	if (Num.indexOf('.') == Num.length-2){ //number ends with a single digit
		Num += "0";
	}
	var a = Num.split(".");
	Num = a[0]; //the part we will commify
	var end = a[1] //the decimal place we will ignore and add back later
	}
	else {var end = "00";}

	//this loop actually adds the commas
	for (var k = Num.length-1; k >= 0; k--){
		var oneChar = Num.charAt(k);
		if (count == 3){
			newNum += ",";
			newNum += oneChar;
			count = 1;
			continue;
		}
		else {
			newNum += oneChar;
			count ++;
		}
	} //but now the string is reversed!
	//re-reverse the string
	for (var k = newNum.length-1; k >= 0; k--){
		var oneChar = newNum.charAt(k);
		newNum2 += oneChar;
	}

	// add dollar sign and decimal ending from above
	newNum2 = "$" + newNum2 + "." + end;
	return newNum2;	
}

function convertVariablesToMonies( ) {
	/* 
   		RA: monthly payment 
		RP: loan amount
		Ri: interest
		Rn: loan period
		RF: future value
		RI: interest amount
		RT: total amount
	*/
	/*
	f = document.form;
	f.RF.value = convertVariableToMoney(f.RF.value);
	f.RA.value = convertVariableToMoney(f.RA.value);
	f.RI.value = convertVariableToMoney(f.RI.value);
	f.RT.value = convertVariableToMoney(f.RT.value);
	*/	
}

function round(variable) {
	return Math.round(variable * 100) / 100;
}

function convertVariableToMoney(variable) {
	if (variable==null) {
		return variable;
	}
	else {
		variable = round(variable);
		variable = commify(variable);
		return variable;
	}
}

function solveForPayment( ) {
	/* 
   		A: monthly payment (solving)
		P: loan amount
		i: interest
		n: loan period
	*/
	if (checkForMissingData(['P','i','n'])) { return; }
	var A, P, i, n;
	f = document.form;
	P = f.P.value;
	i = f.i.value / 12 / 100;
	n = f.n.value;
	if (!isPUMonth( )) {
		pow = Math.pow(1+i,n*12);
	}
	else {
		pow = Math.pow(1+i,n);
	}
	A = P*((i*pow)/(pow - 1));
	f.A.value = A;
	setResults( );
}

function applyNewtonRaphsonMethodForInterestRate(i,A,P,n) {
	/* 
   		A: monthly payment 
		P: loan amount
		i: guessed interest 
		n: loan period
		i2 = next guessed interst (solving)
		Fi: interest function
		Fii: interest function derivative
	*/
	var Fi,Fii,i2;
	Fi = 1 - (Math.pow((1+i),(-n))) - ((P/A) * i);
	Fii = (n*(Math.pow((1+i),(-n-1)))) - (P/A);
	i2 = i - (Fi/Fii);
	return i2
}

function solveForInterestRate( ) {
	/* 
   		A: monthly payment 
		P: loan amount
		i: interest (solving)
		n: loan period
	*/
	if (checkForMissingData(['P','A','n'])) { return; }
	else if (!checkForPaymentLessThanPresentValue( ))  { return; }
	var A, P, i, n;
	var diff, newdiff,temp;
	f = document.form;
	A = f.A.value;
	P = f.P.value;
	n = f.n.value;
	if (!isPUMonth( )) {
		n = n*12;	
	}
	diff = 10000;
	i = 0.1;
	A = new Number(A);
	P = new Number(P);
	n = new Number(n);
	i = new Number(i);
	i = 0.1;
	for (var k=0;k<20;k++) {
		temp = i;
		i = applyNewtonRaphsonMethodForInterestRate(i,A,P,n);
		newdiff = Math.abs(i-temp);
		if (diff <= newdiff) { 
			break; 
		}
		diff = newdiff;
	}
	f.i.value = i * 100 * 12;
	setResults( );
}

function applyNewtonRaphsonMethod(x,p,n) {
	/* 
   		A,x: monthly payment 
		P,p: loan amount
		i: interest (solving)
		n: loan period 
	*/
	var k = 0;
	var i = new Array( );
	var diff,diff2;
	i[k] = 0.003846;
	for (k=0;k<100;k++) {
	//	diff = Math.abs(i[k+1]-i[k]);
		t1 = (x*(1 - (i[k]*p/x)));
		t2 = (n*i[k] + Math.log(1 - (i[k]*p/x)));
		t3 = (((x*n)*(1-i[k]*p/x)) - p);
		i[k+1] = i[k] - ((t1*t2)/t3);
	//	diff2 = Math.abs(i[k+1] - i[k]);
	//	if (diff2 > diff) {
	//		break;
	//	}
	}
	return i[5]*12;
}

function solveForMonths( ) {
	/* 
   		A: monthly payment 
		P: loan amount
		i: interest
		n: loan period (solving) 
	*/
	if (checkForMissingData(['P','i','A'])) { return; }
	else if (!checkForPaymentLessThanPresentValue( ))  { return; }
	var A, P, i, n;
	f = document.form;
	A = f.A.value;
	P = f.P.value;
	i = f.i.value / 12 / 100;
	n = Math.log(A/(A-(P*i))) / Math.log(1+i);
	if (!isPUMonth( )) {
		n = n/12;
	}
	f.n.value = n;
	setResults( );
}

function solveForPresentValue( ) {
	/* 
   		A: monthly payment 
		P: loan amount (solving)
		i: interest
		n: loan period
	*/
	if (checkForMissingData(['A','i','n'])) { return; }
	var A, P, i, n;
	f = document.form;
	A = f.A.value;
	i = f.i.value / 12 / 100;
	n = f.n.value;
	if (!isPUMonth( )) {
		n = n*12;
	}
	pow = Math.pow(1+i,n);
	P = (A*(pow - 1))/(i*pow);
	f.P.value = P;
	setResults( );
}

function solveForFutureValue( ) {
	/* 
		P: loan amount 
		i: interest
		n: loan period
		F: future value (solving)
	*/
	if (checkForMissingData(['P','i','n'])) { return; }
	var P, i, n, F;
	f = document.form;
	P = f.P.value;
	i = f.i.value / 12 / 100;
	n = f.n.value;
	if (!isPUMonth( )) {
		n = n*12;
	}
	pow = Math.pow(1+i,n);
	F = P * pow;
	f.F.value = F;
	setResults( );
}

function main(arg) {
	switch(arg) {
		case 'Init': init( ); break;
		case 'SwitchSolveFor': switchSolveForCommand( ); break;
		case 'Solve': solveCommand( ); break;
		case 'Amortize': solveCommand( );  amortizeCommand( ); break;
	}
}

var solveForInfoBoxState;

function disableAmortized( ) {
	e = document.form.M.disabled=true;
	e = document.form.Y.disabled=true;
}

function init( ) {
	switchSolveForCommand( );
	setAmortizeDefaultDate( );
}

function setAmortizeDefaultDate( ) {
	var date = new Date( );
	f = document.form;
	f.Y.selectedIndex = date.getYear( ) - 80;
	f.M.selectedIndex = date.getMonth( );
}

function switchSolveForCommand( ) {
	var solveFor;
	unsetMissingDataError( );
	f = document.form;
	solveFor = f.solveFor.value;
	switch(solveFor) {
		case 'A': setSolveForPaymentInfo( ); break;
		case 'P': setSolveForPresentValueInfo( ); break;
		case 'i': setSolveForInterestRateInfo( ); break;
		case 'n': setSolveForMonthsInfo( ); break;
		case 'F': setSolveForFutureValueInfo( ); break;
		default: break;
	}
}

function resetSetSolveForInfo(newId) {
	var id;
	if (!solveForInfoBoxState) {
		id="solveForPaymentInfo";
	}
	else {
		id=solveForInfoBoxState;
	}
	e = document.getElementById(id);
	e.style.display = "none";
	solveForInfoBoxState = newId;
}

function setSolveForPaymentInfo( ) { 
	var id = "solveForPaymentInfo";
	resetSetSolveForInfo(id);
	e = document.getElementById(id);
	e.style.display = "block";
}
function setSolveForPresentValueInfo( ) { 
	var id = "solveForPresentValueInfo";
	resetSetSolveForInfo(id);
	e = document.getElementById(id);
	e.style.display = "block";
}
function setSolveForInterestRateInfo( ) { 
	var id = "solveForInterestRateInfo";
	resetSetSolveForInfo(id);
	e = document.getElementById(id);
	e.style.display = "block";
}
function setSolveForMonthsInfo() { 
	var id = "solveForMonthsInfo";
	resetSetSolveForInfo(id);
	e = document.getElementById(id);
	e.style.display = "block";
}
function setSolveForFutureValueInfo( ) { 
	var id = "solveForFutureValueInfo";
	resetSetSolveForInfo(id);
	e = document.getElementById(id);
	e.style.display = "block";
}

function amortizeCommand( ) {
	amortize( );
}

function solveCommand( ) {
	var solveFor;
	f = document.form;
	convertVariablesToIntegers( );
	solveFor = f.solveFor.value;
	switch(solveFor) {
		case 'A': solveForPayment( ); break;
		case 'P': solveForPresentValue( ); break;
		case 'i': solveForInterestRate( ); break;
		case 'n': solveForMonths( ); break;
		case 'F': solveForFutureValue( ); break;
		default: solveForInterestRate( ); break;
	}
	convertVariablesToMonies( );
}
