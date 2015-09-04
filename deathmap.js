var current_radio = 1;
var kill_count = [];
var kill_count_male=[];
var kill_count_female=[];
var death;
var width = 1400,
    height = 1100;

var projection = d3.geo.albersUsa()
    .scale(1700)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id","markersvg");

display_markers();

function handleClick(myRadio) {
	
 //   alert('New value: ' + myRadio.value);
    current_radio = myRadio.value;
   display_markers(); 
}

function display_markers()
{

d3.json("us.json", function(error, topology) {
  if (error) throw error;


  svg.selectAll("path")
      .data(topojson.feature(topology, topology.objects.states).features)
    .enter().append("path")
      .attr("d", path);

d3.csv("slategundeaths.csv", function(data)
	{ 
		//kill_count = [];
		dataset = data.map(function(d){
												return {age: +d["age"], 
												ageGroup: +d["ageGroup"], 
												city: d["city"],
												date: d["date"],
												gender: d["gender"],
												name: d["name"],
												state: d["state"],
												url: d["url"],
												victimID: +d["victimID"],
												lat: +d["lat"],
												lng: +d["lng"]
												};});

//segregate into males and females
//data to be used for different gender classification.
   dataset_male  = [];
   dataset_female = [];
   for(var i=0;i<dataset.length;i++)
   {
   	  if( dataset[i].gender == "M" )    //males 
   	  {
   	  	dataset_male.push(dataset[i]);
   	  }
   	  else 
   	   dataset_female.push(dataset[i]);  //females
   }
//console.log(dataset_male);
//console.log(dataset_female);
//counting for general starts from here
      kill_count = [];
      kill_count[0]=dataset[0].city;  //initialise
      kill_count[1]=1;
   
  for(var i=0; i< dataset.length; i++)
  {
        if(kill_count.indexOf(dataset[i].city)<0)     //add the city if not already exists
      {
        //console.log(kill_count.length)
        var j = kill_count.length;
        kill_count[j] = dataset[i].city;
        kill_count[j+1] = 1;
      }
      else
      if(kill_count.indexOf(dataset[i].city>-1))  //count the repititions
      {
        for(var j=0; j<kill_count.length-1;j++)
        {
          if(kill_count[j]== dataset[i].city)
          {
          kill_count[j+1] = kill_count[j+1] +1;
          }
        }
      }
  }
//counting for general ends here and counting for males starts here

  kill_count_male=[];
      kill_count_male[0]=dataset_male[0].city;  //initialise
      kill_count_male[1]=1;
   
  for(var i=0; i< dataset_male.length; i++)
  {
        if(kill_count_male.indexOf(dataset_male[i].city)<0)     //add the city if not already exists
      {
        //console.log(kill_count.length)
        var j = kill_count_male.length;
        kill_count_male[j] = dataset_male[i].city;
        kill_count_male[j+1] = 1;
      }
      else
      if(kill_count_male.indexOf(dataset_male[i].city>-1)) //count the repititions
      {
        for(var j=0; j<kill_count_male.length-1;j++)
        {
          if(kill_count_male[j]== dataset_male[i].city)
          {
          kill_count_male[j+1] = kill_count_male[j+1] +1;
          }
        }
      }
  }

  //counting for males ends here and females starts here
kill_count_female=[];
      kill_count_female[0]=dataset_female[0].city;  //initialise
      kill_count_female[1]=1;
   
  for(var i=0; i< dataset_female.length; i++)
  {
        if(kill_count_female.indexOf(dataset_female[i].city)<0)     //add the city if not already exists
      {
        //console.log(kill_count.length)
        var j = kill_count_female.length;
        kill_count_female[j] = dataset_female[i].city;
        kill_count_female[j+1] = 1;
      }
      else
      if(kill_count_female.indexOf(dataset_female[i].city>-1)) //count the repititions
      {
        for(var j=0; j<kill_count_female.length-1;j++)
        {
          if(kill_count_female[j]== dataset_female[i].city)
          {
          kill_count_female[j+1] = kill_count_female[j+1] +1;
          }
        }
      }
  }

  //counting for females ends here
console.log(current_radio);
  //console.log(dataset[0].city);
  if(current_radio == 1)				// generate the markers for the general classification
  {
  
//}
console.log(kill_count.length);
		
//adding circles for the general classification here
svg.selectAll("circle").remove();	//removing the earlier circles

svg.selectAll("circle.points")
.data(dataset)
.enter().append("circle")
.attr("transform", function(d){  return "translate(" + projection([d.lng, d.lat]) +")";})
.attr("r",5)
.style("fill","steelblue")
.style("font-weight","bold")
.append("svg:title")
.text(function(d){ 
     
     for(var i=0; i<kill_count.length;i++)
     {
     	if(kill_count[i] == d.city)
     	{
     	death = kill_count[i+1];
        }
      }
	return ("City : "+d.city+ "\n"+"State : "+d.state+"\n"+"Gender Classification : "+"General"+"\n"+"Death Count: "+death)});
}
else if (current_radio == 2)
{
	
//}
console.log(kill_count.length);
		
//adding circles for the male classification here
svg.selectAll("circle").remove();  //removing the earlier circles
svg.selectAll("circle.points")
.data(dataset_male)
.enter().append("circle")
.attr("transform", function(d){  return "translate(" + projection([d.lng, d.lat]) +")";})
.attr("r",5)
.style("fill","red")
.style("font-weight","bold")
.append("svg:title")
.text(function(d){ 
     
     for(var i=0; i<kill_count_male.length;i++)
     {
     	if(kill_count_male[i] == d.city)
     	{
     	death = kill_count_male[i+1];
        }
      }
	return ("City : "+d.city+ "\n"+"State : "+d.state+"\n"+"Gender Classification : "+"Male"+"\n"+"Death Count: "+death)});


}
else if(current_radio == 3)
{
		

svg.selectAll("circle").remove(); //removing the earlier circles
		
//adding circles for the female classification here
svg.selectAll("circle.points")
.data(dataset_female)
.enter().append("circle")
.attr("transform", function(d){  return "translate(" + projection([d.lng, d.lat]) +")";})
.attr("r",5)
.style("fill","black")
.style("font-weight","bold")
.append("svg:title")
.text(function(d){ 
     
     for(var i=0; i<kill_count_female.length;i++)
     {
     	if(kill_count_female[i] == d.city)
     	{
     	death = kill_count_female[i+1];
        }
      }
	return ("City : "+d.city+ "\n"+"State : "+d.state+"\n"+"Gender Classification : "+"Female"+"\n"+"Death Count: "+death)});

}


});

//adding circles ends here
});

}
