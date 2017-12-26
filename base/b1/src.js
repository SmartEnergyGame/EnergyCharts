'use strict'
const radius=20
let height=400
let width=1000
let Maxradius=15
let len=0
let x0=50
let y0=30
let home=0
let maxValue=1500
let margin={top:20,right:40,bottom:40,left:40};let legendRectSize=18
let legendSpacing=4
let color=d3.scaleOrdinal(d3.schemeCategory20b);let customColors=["#A6A6A6","#595959"]
let labelsLegends=[{label:'Your household'},{label:'Other households'}];let elements=[]
let iradios=[]
function getRadius(r){return(Maxradius/len)*42*(Maxradius/r)}
function getX(e,r){let res=(width/len)*(r+1)+x0
return res}
function getY(e,r){let res=(maxValue-elements[r].y)/(maxValue/height)+y0
return res}
function getColor(d,i){if(i==home)return customColors[0]
return customColors[1]}
function generate(dataset){let posx=0
let n=dataset.length
let elements=[]
for(let i=0;i<n;++i){if(dataset[i][0])
elements.push({"radius":radius,"y":dataset[i][1],"name":dataset[i][0]})}
return elements}
function paint(nameDiv){let ibody=d3.select("#"+nameDiv)
let isvg=ibody.append("svg").attr("width",width+margin.left+margin.right).attr("height",height+margin.left+margin.right).attr("transform","translate("+(margin.left+40)+","+margin.top+")")
let xscale=d3.scaleLinear().domain([0,iradios.length]).range([0,width]);let yscale=d3.scaleLinear().domain([0,maxValue]).range([height,0])
let x_axis=d3.axisBottom().scale(xscale).ticks(0)
let y_axis=d3.axisLeft().scale(yscale).tickPadding(7).ticks(5).tickValues(d3.range(0,maxValue+100,300)).tickSize(0,0)
let icircles=isvg.selectAll("circle").data(iradios).enter().append("circle")
isvg.append("g").attr("transform","translate("+x0+", "+y0+")").call(y_axis);isvg.append("g").attr("transform","translate("+x0+", "+(height+y0)+")").style("stroke-dasharray",("10, 10")).call(x_axis)
isvg.append("text").attr("text-anchor","middle").attr("transform","translate("+15+","+(height/2)+")rotate(-90)").text("kWh / Month").attr("class","tittle")
let iattr=icircles.attr("cx",getX).attr("cy",getY).attr("r",getRadius).style("fill",getColor)
let legend=isvg.selectAll('.legend').data(labelsLegends).enter().append('g').attr('class','legend').attr('transform',function(d,i){let h=legendRectSize+legendSpacing;let offset=h*color.domain().length/2;let horz=i*10*h-offset+width/2-50
let vert=(height+y0+20)
return'translate('+horz+','+vert+')'});legend.append('circle').attr('r',10).style('fill',function(d,i){return customColors[i]}).style('stroke',"black");legend.append('text').attr('x',legendRectSize+legendSpacing).attr('y',legendRectSize-legendSpacing-8).text(function(d){return d.label})}
class Peak{constructor(nameFile){this.nameFile=nameFile}
plot(nameDiv,myhome,flag=!0){home=myhome
const arrayColumn=(arr,n)=>arr.map(x=>x[n])
d3.csv(this.nameFile,function(data){if(flag){let dataset=[]
for(let e in data){let info=data[e]
let name=info.name
let value=parseInt(info.y)
dataset.push([name,value])}
elements=generate(dataset)}else{for(let e in data){let info=data[e]
let name=info.name
if(info.y){let value=parseInt(info.radius)
let y=parseInt(info.y)
elements.push({"radius":value,"y":y,"name":name})}}}
len=elements.length
iradios=arrayColumn(elements,"radius")
paint(nameDiv)})}}