//-------- //lib 分析瀏覽器 ---------------------------------------------------------------------
  var xmlHttp = null;
	if (typeof XMLHttpRequest != "undefined"){
    	//適用新版IE(6.0以後), Mozilla, Chrome, Safari, Opera....
    	xmlHttp = new XMLHttpRequest();
	}else if (typeof window.ActiveXObject != "undefined"){
    	//除Microsoft.XMLHTTP使用在IE6(含)以前版本，其它都是用在較新版本
    	var ax = new Array ("Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0","Msxml2.XMLHTTP.3.0",
                          "Msxml2.XMLHTTP.2.6", "MSXML2.ServerXMLHTTP", "MSXML2.XMLHTTP","Microsoft.XMLHTTP");
   		for (var i=0; i<ax.length; i++){
        		try {		xmlHttp = new ActiveXObject(ax[i]);
     				        if (typeof xmlHttp == "object") break;
        		} catch (error)
                    {	xmlHttp = null;	}
    	}
	}
//-------	//設定回傳檔頭mime type格式 -----------------------------------------------------------
	if (typeof xmlHttp.overrideMimeType != "undefined"){ xmlHttp.overrideMimeType("text/html; charset=utf-8"); }
// ============================================================================================
  function show_succ(id){
    xmlHttp.onreadystatechange = function (){
    	//readyState有：0準備, 1讀取中, 2已讀取, 3交換中, 4已完成 等狀態
    	if (xmlHttp.readyState == 4){
        	//status有：200 OK、404無法顯示網頁、500內部錯誤.....
        	if (xmlHttp.status == 200){
            	//接收一般文字回傳值，可以直接使用
            	var data = xmlHttp.responseText;  
            	//或接收XML文件回傳值，XML文件要處理過才能使用
            	//var data = http_request.responseXML;
              document.getElementById(id).innerHTML = "　　";
              switch (data.substr(0,3))
                  {
                    case "e1," :
                    case "e2," :
                    case "D2," :
                    case "e3," :
                    case "D3," :  document.getElementById(id).innerHTML = data.substr(3); break;
                    case "D1," :  document.getElementById("mbName").innerHTML =data.substr(3)+"會員, 您好！<a style='text-decoration:none;cursor:pointer;' >《登出》</a>";
                                  //setCookie('Act',$('#emai3').val(),3);
                                  $('#div_Bd7').css('display','none');
                                  $('#div_Bd0').css('display','block');
                                  //$('#uh li:eq(0)').html('<a id="srv" >會員服務</a>');
                                  $('#uh li:eq(0) a').attr("id","srv");
                                  $('#srv').text('會員服務GO!');                                  
                                  $('#memsrv').css('display','block');
                                  break;
                  }
              
               }           
       	  else { alert(xmlHttp.status); }
    	}
    }
  }
//-----------------------------------------------------------------------------------------------
  function callAjaxDo(id,sw,url,options) {
    var resp=(id=="")?"NG":"";
    switch(sw)  {        
        case "g" :  //GET方式
                    show_succ(id);
            				xmlHttp.open('GET',url+"?"+options,true);
            				xmlHttp.send(null);				
        break;
        case "p" :  //POST方式
                    show_succ(id);
                    xmlHttp.open('POST',url, true);
            				xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            				xmlHttp.send(options);  //這裡面指定要POST的值
        break;
        //----------------------------------------------------------
        case "j" :  //$.getJSON方式 jsonp
                    var data = $.getJSON(url,options);
                    //成功得到資料
                    data.success(function(data) { $.each(data, function(key,val){
                        if(key=="atmno")      $("#"+id).html(val);
                        if(key=="orderNo")  { $("#"+id+",#"+id+"1").text(val);
                                                tr_yy=(parseInt(val.substr(1,2))+100-11);
                                                date=tr_yy+'/'+val.substr(3,2)+'/'+val.substr(5,2);
                                                $('#trdate').text(date); }
                        if(key=="AnsL")     { if(val=="OK") { alert("<== 登出完成 ==>"); top.location="http://"+HTTP_IP+"index.php"; exit; } }
                        if(key=="AnsM")     { if(val=="OK") {top.location="http://"+HTTP_IP+"PF4evs/bk4_main.php?idsw=wlcom";exit;}
                                              else { alert("^_^ !! 無此帳號或密碼 !! ^_^"); $('#psp2').hide(); $('#psp1').show(); }
                                            }
                        });
                    });
                    //取得資料失敗
                    data.error(function(data) { alert("fail getting data"); });
                    
        break;
        case "s" :  //$.ajax方式 JSONP（JSON with Padding）
                    $.ajax({
                          url        : url,
                          type       : 'GET',
                          data       : options,
                          dataType   : 'json',  //use jsonp/json data type in order to perform cross domain ajax
                          crossDomain: true,
                          //成功得到資料
                          success    : function(data,textStatus,jqXHR){ $.each(data, function(key,val)
                                        {
                                          if(key=="atmno")    $("#"+id).html(val);
                                          if(key=="orderNo"){ $("#"+id+",#"+id+"1").text(val);
                                                                tr_yy=(parseInt(val.substr(1,2))+100-11);
                                                                date=tr_yy+'/'+val.substr(3,2)+'/'+val.substr(5,2);
                                                                $('#trdate').text(date); }
                                          if(key=="AnsL")   { if(val=="OK") { alert("<== 登出完成 ==>"); top.location="http://"+HTTP_IP+"index.php"; exit; } }
                                          if(key=="AnsM")   { if(val=="OK") { top.location="http://"+HTTP_IP+"PF4evs/bk4_main.php?idsw=wlcom"; exit;}
                                                              else { alert("^_^ !! 無此帳號或密碼 !! ^_^"); $('#psp2').hide(); $('#psp1').show(); } }
                                        }
                                       )},
                          //取得資料失敗
                          error      : function(data,textStatus,errorThrown){ alert("<== fail getting data - "+textStatus+" == "+errorThrown+" ==>");},
                          });
        break;
    }
  }
// ----------------------------------------------------------------------------------- //
//              子視窗的開啟/關閉/變更
//參數w_func表示要做視窗的功能，w_url表示要打開的網站，w_name表示打開後的窗體名稱
//參數w_width表示打開窗體的寬度，w_height表示打開窗體的高度
// ====> 須要 global var winID=winID?winID:null;
function OCR_window(w_func,w_url,w_name,w_width,w_height) {  
  switch(w_func) {
    case 'O': //開啟置中子視窗
        var w_features="",xposition=15,yposition=35;
        if(w_width!=0||w_height!=0)
          {
            if(window.screen) //取得螢幕解析度
                {
                  xposition=(screen.width-w_width)/2;           //窗體居中的x坐標
                  yposition=(screen.availHeight-w_height)/2;    //可視窗體居中的y坐標
                }               
            //打開視窗的屬性
            w_features+="width="+w_width
                      + ",height="+w_height 
                      + ",screenx="+xposition     //僅適用於Netscape
                      + ",screeny="+yposition     //僅適用於Netscape
                      + ",left="+xposition        //IE
                      + ",top="+yposition         //IE
                      + ",directories=0" 
                      + ",location=0" 
                      + ",menubar=0"
                      + ",resizable=1"
                      + ",scrollbars=0"
                      + ",status=0" 
                      + ",titlebar=0"
                      + ",toolbar=0"
                      + ",hotkeys=0";            
          } 
        winID=window.open(w_url,w_name,w_features);
        winID.location.href=w_url;
        winID.focus();
    break;
    case 'C': //關閉子視窗     
        if(winID&&winID.open&&!winID.closed)
          winID.close();    
    break;          
    case 'R': //變更子視窗
        if(winID&&winID.open&&!winID.closed)
          winID.location.href=w_url;
          winID.focus();
    break;
    default:
        alert("w_func = "+w_func);
    break;
    }
}
// ----------------------------------------------------------------------------------- //
//           處理顯示的項目
//參數id表示要處理顯示的元素ID名，參數item表示要顯示的項目，參數last_item表示要處理顯示否的最後一個項目數
//參數tpe表示要處理選取顯示的下一個相關項目
function disp_handle(id,item,last_item,tpe)
  {
    for (var i=0; i<=last_item; i++) { document.getElementById(id+i).style.display = 'none'; }
    document.getElementById(id+item).style.display = 'block'; 
    if(tpe==1) document.getElementById(id+item+'0').checked = true;
  }
// ----------------------------------------------------------------------------------- //
//            產生與變更視框窗內檔
//參數id表示要處理顯示的元素ID名，參數scrname表示要顯示的檔案名
function set_scrfile(id,scrname)
  {    
    if(!scrname) document.getElementById(id).innerHTML = '';
    if(scrname)  document.getElementById(id).innerHTML = '<iframe name="myiframe" width="98%" height="100%" align="center" src="'+scrname+'" style="margin-left:4px;background-color:#FFEFDF;"/></iframe>';
  }
// ----------------------------------------------------------------------------------- //
//            產生與變更區塊內圖檔
//參數id表示要處理顯示的元素ID名，參數FTcolor表示標題字titlename要顯示的顏色
//參數titlename表示顯示的標題文字，參數imgname表示要顯示的檔案名  
function set_imgfile(id,FTcolor,titlename,imgname)
  {    
    if(!imgname) document.getElementById(id).innerHTML = ''
    if(imgname)  document.getElementById(id).innerHTML = '<div align="center" style="width:98%;color:'+FTcolor+';font-size:22px;font-weight:bold;font-family:微軟正黑體,新細明體;"><b>'+titlename+'</b><br /><img border="1" src="'+imgname+'" /></div>';
  }
// ----------------------------------------------------------------------------------- //
//            按鈕鍵只能按一次，按過後變灰色
//參數act表示要按鍵 disabled失效0 灰色顯示 / enable復原1 黑色顯示
function mk_able(act,id)
  {
    if(act){ document.getElementById(id).style.color = "black"; document.getElementById(id).disabled = false; }
    else   { document.getElementById(id).style.color = "gray";  document.getElementById(id).disabled = true; }    
  }
// ----------------------------------------------------------------------------------- //
//            檢查 P_ID 身分證號的正確性
//
function check_TWid(sId)
  {
	  var LegalID="0123456789";	  var fResult=true;
	  if(sId.length!=10)	fResult=false;
	  else{
         if((sId.charAt(0)=='A') || (sId.charAt(0)=='a')) value=10
		else if((sId.charAt(0)=='B') || (sId.charAt(0)=='b')) value=11
		else if((sId.charAt(0)=='C') || (sId.charAt(0)=='c')) value=12
		else if((sId.charAt(0)=='D') || (sId.charAt(0)=='d')) value=13
		else if((sId.charAt(0)=='E') || (sId.charAt(0)=='e')) value=14
		else if((sId.charAt(0)=='F') || (sId.charAt(0)=='f')) value=15
		else if((sId.charAt(0)=='G') || (sId.charAt(0)=='g')) value=16
		else if((sId.charAt(0)=='H') || (sId.charAt(0)=='h')) value=17
		else if((sId.charAt(0)=='J') || (sId.charAt(0)=='j')) value=18
		else if((sId.charAt(0)=='K') || (sId.charAt(0)=='k')) value=19
		else if((sId.charAt(0)=='L') || (sId.charAt(0)=='l')) value=20
		else if((sId.charAt(0)=='M') || (sId.charAt(0)=='m')) value=21
		else if((sId.charAt(0)=='N') || (sId.charAt(0)=='n')) value=22
		else if((sId.charAt(0)=='P') || (sId.charAt(0)=='p')) value=23
		else if((sId.charAt(0)=='Q') || (sId.charAt(0)=='q')) value=24
		else if((sId.charAt(0)=='R') || (sId.charAt(0)=='r')) value=25
		else if((sId.charAt(0)=='S') || (sId.charAt(0)=='s')) value=26
		else if((sId.charAt(0)=='T') || (sId.charAt(0)=='t')) value=27
		else if((sId.charAt(0)=='U') || (sId.charAt(0)=='u')) value=28
		else if((sId.charAt(0)=='V') || (sId.charAt(0)=='v')) value=29
		else if((sId.charAt(0)=='X') || (sId.charAt(0)=='x')) value=30
		else if((sId.charAt(0)=='Y') || (sId.charAt(0)=='y')) value=31
		else if((sId.charAt(0)=='W') || (sId.charAt(0)=='w')) value=32
		else if((sId.charAt(0)=='Z') || (sId.charAt(0)=='z')) value=33
		else if((sId.charAt(0)=='I') || (sId.charAt(0)=='i')) value=34
		else if((sId.charAt(0)=='O') || (sId.charAt(0)=='o')) value=35
		else fResult = false ;
	  }
	  if(fResult==true){
		    value = Math.floor(value/10)+(value%10)*9+
                parseInt(sId.charAt(1))*8+parseInt(sId.charAt(2))*7+parseInt(sId.charAt(3))*6+parseInt(sId.charAt(4))*5+
                parseInt(sId.charAt(5))*4+parseInt(sId.charAt(6))*3+parseInt(sId.charAt(7))*2+parseInt(sId.charAt(8))*1+
                parseInt(sId.charAt(9));
		    value = value % 10 ;
		    if(value!=0) fResult = false ;
		    var c;
		    for (var i=1; i<sId.length; i++)
            {  c = sId.charAt(i);  if (LegalID.indexOf(c) == -1) fResult = false;	}
	  }
	  if(fResult==false)		return false;
	  else		return true;
	}
// ----------------------------------------------------------------------------------- //
//            檢查 C_ID 公司統編的正確性
//
function check_TB(sId)
  {
    var tbNum=new Array(1,2,1,2,1,2,4,1);
    var temp =0;  var total=0;
    if(sId.length!=8)  return false;
    else{
        for (var i=0; i<tbNum.length ;i++)
                  {  temp=sId.charAt(i)*tbNum[i];
                     total+=Math.floor(temp/10)+temp%10;
                  }
        if(total%10==0||(total%10==9&&sId.charAt(6)==7)) return true;
        else  return false;
        }
  }
// ----------------------------------------------------------------------------------- //
//            檢查 E-mail 電子信箱的正確性
//參數addr表示要檢查的電子信箱
function chk_email(addr)
  {
		var m = /^([a-zA-Z0-9])([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9])+$/;
    if(addr==''||addr.match(m)==null) return false;		
		else return true;
	}
// ----------------------------------------------------------------------------------- //
//            產生排列照片圖表格一覽
//參數id0表示要產生顯示標題文字位置的元素ID名，參數title表示顯示的標題文字，參數folder表示要顯示的照片圖表所在的資料夾名
//參數id1表示要產生顯示照片圖表位置的元素ID名，參數field表示顯示照片圖表欄位數，參數totalpic表示顯示照片圖張數  
function pic_table(id0,title,folder,id1,field,totalpic)
  { 
    var str; var tdw=Math.round(100/field-0.5);
    var pic_w=Math.round(474*tdw/100);  var pic_h=Math.round((pic_w*0.78)-0.5);
    str="<table align='center' border='1'>";
    for(var j=0;j<totalpic;j++)
      { str+="<tr align='center'>"; 
        for(var i=1;i<=field;i++)
          {
            var idx=i+j*field;
            str+="<td width='"+tdw+"%'>";
            if (idx<=totalpic)
              { 
                if(field<3)  str+="<img src='../images/pic"+folder+"/photo"+idx+".jpg' width='"+pic_w+"' height='"+pic_h+"' >";
                else  {
                    str+="<a onclick='enlarge_pic(\""+id0+"\",\""+title+"\",\""+folder+"\",\""+id1+"\","+idx+","+totalpic+");' href='javascript:;'>";
                    str+="<img src='../images/pic"+folder+"/photoA"+idx+".jpg' width='"+pic_w+"' height='"+pic_h+"' >";
                    str+="</a>";
                }
              }
            str+="</td>";
          }        
        str+="</tr>";if(idx>=totalpic) j=totalpic;
      }    
    str+="</table>";
    var ht=document.getElementById(id0);
    ht.innerHTML=title+"(共有"+totalpic+"張)";
    var dv=document.getElementById(id1);
    dv.innerHTML=str;
  }
function enlarge_pic(id0,title,folder,id1,in_idx,totalpic)
  {
    var pic_w=474;  var pic_h=Math.round((pic_w*0.78)-0.5); 
    str="<table align='center' border='0' style='color:brown;font-size:large;'>";
    str+="<tr>";
    str+="<td width='9%' align='center'><a onclick='x=roll_table(\"Dmg\",0,"+totalpic+",\"pn1\",\""+title+"\",\""+folder+"\");var idx=x;' href='javascript:;'>■《</a></td>";
    str+="<td width='82%' align='center' height='200'>";
    str+="<div id='Dmg'><img src='../images/pic"+folder+"/photo"+in_idx+".jpg' border='1' align='middle' width='400' height='251'/></div>";
    str+="</td>";
    str+="<td width='9%' align='center'><a onclick='x=roll_table(\"Dmg\",1,"+totalpic+",\"pn1\",\""+title+"\",\""+folder+"\");var idx=x;' href='javascript:;'>》■</a></td>";
    str+="</tr></table>";
    var ht=document.getElementById(id0);
    ht.innerHTML=title+"(第"+in_idx+"/"+totalpic+"張)";
    var dv=document.getElementById(id1);
    dv.innerHTML=str; idx=in_idx;
  }
function roll_table(id0,p_m,totalpic,id1,title,folder)
  { 
    idx=(p_m)?idx+1:idx-1;
    if (idx==0) idx=totalpic; if (idx>totalpic) idx=1;
    var dv=document.getElementById(id0);    
    str='<img src="../images/pic'+folder+'/photo'+idx+'.jpg" border="1" align="middle" width="400" height="251"/>';
    dv.innerHTML=str;
    var ht=document.getElementById(id1);
    ht.innerHTML=title+"(第"+idx+"/"+totalpic+"張)";return idx;
  }  
// ----------------------------------------------------------------------------------- //
//            產生賣的商品照片圖一覽
//參數id0表示要顯示商品照片圖位置的元素ID名，參數p_m表示顯示照片要往右(=1：next-下一張圖)往左(=0：back-上一張圖)
//參數total表示總共要顯示商品照片圖的張數，參數id1表示要顯示商品照片圖總頁數位置的元素ID名
// ====> 須要 globalvar idx=1;
function buysrv_table(id0,p_m,totalpic,id1)
  {
    idx=(p_m)?idx+1:idx-1;
    if (idx==0) idx=totalpic; if (idx>totalpic) idx=1;
    var dv=document.getElementById(id0);
    /*dv.scr="../images/picbuy"+idx+".jpg";alert("==="+dv.scr+"==");*/
    str='<img src="../images/picbuy'+idx+'.jpg" border="1" align="middle" width="400" height="200"/>';
    dv.innerHTML=str;
    str= "如須服務請與社務 潘助理 秀枝 聯繫 (商品是 "+idx+"/"+totalpic+" 頁)<br/>";
    var pv=document.getElementById(id1);    
    pv.innerHTML=str;
  }
// ----------------------------------------------------------------------------------- //
//            產生民國xxx年xx月xx日星期X xx時xx分xx秒的資料
function show_today()
  {
    var today=new Date(); var weekday=["日","一","二","三","四","五","六"]; 
    var result_today = new Array();    
    result_today[0]=today.getFullYear();                                                    //西元年
    result_today[1]=today.getFullYear()-1911;                                               //民國年
    var Mon=today.getMonth()+1;
    result_today[2]=(Mon<10)?('0'+Mon):Mon;                                                 //月
    result_today[3]=(today.getDate()<10)?('0'+today.getDate()):today.getDate();             //日
    result_today[4]=weekday[today.getDay()];                                                //星期    
    result_today[5]=(today.getHours()<10)?('0'+today.getHours()):today.getHours();          //小時
    result_today[6]=(today.getMinutes()<10)?('0'+today.getMinutes()):today.getMinutes();    //分
    result_today[7]=(today.getSeconds()<10)?('0'+today.getSeconds()):today.getSeconds();    //秒
    return result_today;
  }
// ----------------------------------------------------------------------------------- //
//            Read URL GET variables
/*function getUrlVars()
{
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                function(m,key,value) { vars[key]=value;  });
    return vars;
}*/
function getUrlVars(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
// ----------------------------------------------------------------------------------- //
//                Make tables tbody in client
function make_tbody(tbID,rowarray)
  {
    var tbLID=document.getElementById(tbID);
    for(var row=0;row<rowarray.length;row++)
        {
          var col_td=rowarray[row].split(",");
          var tr=tbLID.insertRow(row+1);
          //var tr_clssna=((row+1)%2!=0)?"tr_even":"tr_odd"; // font color diff in row
          tr.align="center";  //tr.className=tr_clssna;
          for(var col=0;col<col_td.length;col++)
            {
              var td=tr.insertCell(col);
              var clssna=((col)%2!=0)?"ptd_o12":"ptd_e12";
              if (col!=0&&col!=col_td.length-1) {td.align="right"};
              td.className=clssna;
              td.innerHTML=col_td[col];
            }
        }
    $('#'+tbID+' tbody tr:even').css('background-color','#E6F2F2').mouseout(function(){$(this).css('background-color','#E6F2F2');});
    $('#'+tbID+' tbody tr:odd').css('background-color','#FFDEDF').mouseout(function(){$(this).css('background-color','#FFDEDF');});        
    
    $('#'+tbID+' tbody tr:not(:last)').mouseover(function(){$(this).css({'background-color':'#CCFF88','cursor':'pointer'})});
  }
// ----------------------------------------------------------------------------------- //
//                POST(Ajax) data from server to client
function getrecdata(tblID,row)
  {      tdNo=(row[0].split(",")).length;
         make_tbody(tblID,row);
    $('#'+tblID+' tbody tr:not(:last)').click(function(){ if($(this).find('td').eq(0).text()!='')
                    {
                        if(confirm('我要購買本『'+$(this).find('td').eq(0).text()+'』之保險'))
                            {   
                                
                                var threc=vehD.substr(0,vehD.length-1);
                                threc+=","+$('#icd21').val();
                                threc+=$("#icd48").is(":checked")?(","+$('#icd48').val()):"";
                                threc+=$('#icd33').is(":checked")?(","+$('#icd33').val()+","+$('#icd31').val()+","+$('#icd32').val()):'';
                                threc+='"';
                                $('#vehD1').val(threc); saveStorage_S('vehD1');     //alert($('#vehD1').val());
                                var tdrec='"';
                                for(i=0;i<tdNo;i++)
                                { 
                                  var rowF=((i==2&&!$("#icd48").is(":checked"))||(i==3&&!$('#icd33').is(":checked")))?'':($(this).find('td').eq(i).text());
                                  if(rowF){ tdrec+=(i!=(tdNo-1))?(rowF+","):(rowF+'"'); }
                                }                                  
                                $('#insD1').val(tdrec); saveStorage_S('insD1');     //alert($('#insD1').val());
                                window.top.location='veh2.htm'; 
                            }
                    }
    });
  }
// ----------------------------------------------------------------------------------- //
//                      Before Submit check inputform data
function chk_form(mc,id)
{
  var sw=0; var err_msg='《 請看紅底項目，有欄位未輸、選或有錯！》\n'; var str = '"';
  str+=(mc=='1')?'1':'0';

  for (var i=0;i<id.length;i++) {
    var Rid=id[i].substring(1);                      //alert(Rid);
    var doc_x=document.getElementById(Rid);
    var doc_m=document.getElementById(Rid+'_m');
    var doc_c=document.getElementById(Rid+'_c');
    var doc_d=document.getElementById(Rid+'_d');
    var doc_e=document.getElementById(Rid+'_e');

    switch(id[i]) { 
      case "xgrykid":
          if(!doc_m.checked && !doc_c.checked)
            { $('#xgrykid').addClass("pdata"); sw=1; err_msg+='● 請選擇投保車輛身份\n';}
          else {if(doc_m.checked) doc_x.value=doc_m.value; if(doc_c.checked) doc_x.value=doc_c.value;
                str+=","+doc_x.value;}
      break;
      case "xcustid":
      case "xcusti2":
      case "xfirmid":          
          if(doc_x.value==''||doc_x.value=='身分證號/公司統編'||((doc_x.value).length!=10&&(doc_x.value).length!=8)||(((doc_x.value).length==10&&!check_TWid(doc_x.value))||((doc_x.value).length==8&&!check_TB(doc_x.value))))
            { $('#'+id[i]).addClass("pdata"); sw=1; err_msg+='● 請填寫證號/統編；或格式錯誤\n';}
          else {str += ","+doc_x.value;}
      break;
      case "xbirday":
          var cc=parseInt(doc_c.value); var dd=parseInt(doc_d.value);
          if(doc_m.value==''||(doc_c.value==''||cc<=0||cc>12)||(doc_d.value==''||dd<=0||dd>31))
            { $("#xbirday").addClass("pdata"); sw=1;  err_msg+='● 請選擇(輸入/有錯)出生日期\n';}
          else {str += ","+doc_m.value+doc_c.value+doc_d.value;}
      break;
      case "xvehknd":
          if (mc=='1') { doc_x.value=doc_c.value; tmp='#'+id[i]+'_c'; }
          else         { doc_x.value=doc_m.value; tmp='#'+id[i]+'_m'; }
          if (doc_x.value=='') { $(tmp).addClass("pdata"); sw=1;  err_msg+='● 請選擇車輛種類\n';}
          else {str+=","+doc_x.value;}
      break;
      case "xp_dur":
          if (mc=='1') { doc_x.value=doc_c.value; tmp='#'+id[i]+'_c'; }
          else         { doc_x.value=doc_m.value; tmp='#'+id[i]+'_m'; }          
          if (doc_x.value=='') { $(tmp).addClass("pdata"); sw=1;  err_msg+='● 請選擇保險期間\n';}
          else {str+=","+doc_x.value;}
      break;
      case "xvehlno":
          var flag=0; 
          if (mc=='1') { doc_x.value=doc_c.value; tmp='#'+id[i]+'_c'; }
          else         { doc_x.value=doc_m.value; tmp='#'+id[i]+'_m'; }
          if (doc_x.value=='') { flag=1; var msg='● 請填寫車牌號碼\n';}         
          else { var len=doc_x.value.length; var pos=doc_x.value.indexOf('-');
                 if (mc=='0'&&((len!=5&&len<7)||len>8||pos<2||pos>4))
                               { flag=1; var msg='● 請填寫正確機車車牌號碼\n　 例:ABC-123/123-ABC\n　 或 ABC-1234/123-ABCD\n　 或 ABCD-123/1234-ABC\n　 或 AB-12/12-AB(大型)\n';}
                 if (mc=='1'&&(len<7||len>8||pos<2||pos>4))
                               { flag=1; var msg='● 請填寫正確汽車車牌號碼\n　 例:AB-1234/1234-AB\n　 或 ABC-1234/1234-ABC\n';}
               }
          if (flag) { $(tmp).addClass("pdata"); sw=1; err_msg+=msg; }
          else {str+=","+doc_x.value;}
      break;
      /*case "xinsna":          
          if (doc_x.value=='') { $("#xinsna").addClass("pdata"); sw=1;  err_msg+='● 請選擇產險公司\n';}
      break;*/
      case "xagree":
           if(!doc_x.checked){$('#xagree').addClass("pdata"); sw=1; err_msg+='● 須同意才可查詢\n';}
      break;
// --------------------------------------------------------------------------------------------------- //      
      case "xnative":
          if(!doc_m.checked && !doc_c.checked)
          { $('#xnative').addClass("pdata"); sw=1; err_msg+='● 請選擇國籍身份\n';}
          else {doc_x.value=(doc_m.checked)?doc_m.value:doc_c.value;
                str+=","+doc_x.value;}
      break;
      case "xname":
      case "xnam2":
      case "xnam3":
      case "xfname":
      case "xfnam2":
           if(id[i]=="xfnam2") {tmp=(doc_x.value=='')? "--":doc_x.value; str+=","+tmp;}
           else if(doc_x.value==''){$('#'+id[i]).addClass("pdata"); sw=1; err_msg+='● 請輸入姓名/公司名稱\n';}
           else {str+=","+doc_x.value;}
      break;
      case "xmarry":
          if(!doc_m.checked && !doc_c.checked)
          { $('#xmarry').addClass("pdata"); sw=1; err_msg+='● 請選擇婚姻狀況\n';}
          else {doc_x.value=(doc_m.checked)?doc_m.value:doc_c.value;
                str+=","+doc_x.value;}
      break;
      case "xtelephone":
      case "xtelephon2":
           if(doc_x.value==''||doc_x.value=='請輸入市內電話'){$('#'+id[i]).addClass("pdata"); sw=1; err_msg+='● 請填寫聯絡電話\n';}
           else {str+=","+doc_x.value;}
      break;
      case "xcellphone":
      case "xcellphon2":
      case "xcellphon3":
           if(doc_x.value==''||doc_x.value=='請輸入行動電話'||doc_x.value=='請輸入行動或市話'){$('#'+id[i]).addClass("pdata"); sw=1; err_msg+='● 請填寫電話\n';}
           else {str+=","+doc_x.value;}
      break;
      case "xemail":
      case "xemai2":
      case "xemai3":
      case "xemai4":
           if(!chk_email(doc_x.value)) {$('#'+id[i]).addClass("pdata"); sw=1; err_msg+='● 請填寫電子信箱(正確的)\n';}
           else {str+=","+doc_x.value;}
      break;
      case "xaddres1":
      case "xaddres2":
      case "xaddress1":
      case "xaddress2":
           if(doc_x.value==''){ $('#'+id[i].substr(0,id[i].length-1)).addClass("pdata"); sw=1; err_msg+='● 請填寫聯絡(寄送)地址\n';}
           else {
                  var t_addr="";
                  if ($('#country1 :selected').val()=="臺灣"&&id[i]=="xaddres1")
                        t_addr=$('#PostNo1').val()+"/"+$('#City1').val()+"/"+$('#Canton1').val()+"/";
                  if ($('#country2 :selected').val()=="臺灣"&&id[i]=="xaddress1")
                        t_addr=$('#PostNo2').val()+"/"+$('#City2').val()+"/"+$('#Canton2').val()+"/";                
                  str+=","+t_addr+doc_x.value;}
      break;
      case "xpass":
      case "xpas1":
      case "xvpa1":
           if(doc_x.value==''){$('#'+id[i]).addClass("pdata"); sw=1; err_msg+='● 請輸入密碼\n';}          
           if($("#pas1").val()!=""&&$("#vap1").val()!="") {
              if($("#pas1").val()!=$("#vpa1").val())
                   { $('#'+id[i]).addClass("pdata"); sw=1; err_msg+='● 二次密碼不相同\n';}
              else $('#xpas1,#xvpa1').removeClass('pdata');
           }
           if(!sw) {str+=","+doc_x.value;}           
      break;
// --------------------------------------------------------------------------------------------------- //
      case "xvehfat":
           if(doc_x.value==''){$('#xvehfat').addClass("pdata"); sw=1; err_msg+='● 請填寫(選擇)廠牌型號\n';}
           else {str+=","+doc_x.value;}
      break;
      case "xpaslim":
           if(doc_x.value==''||doc_x.value < 2){$('#xpaslim').addClass("pdata"); sw=1; err_msg+='● 請填寫乘載限額人數(須大於1)\n';}
           else {str+=","+doc_x.value;}
      break;  
      case "xeng":
           if(doc_x.value==''){$('#xeng').addClass("pdata"); sw=1; err_msg+='● 請填寫引擎號碼\n';}
           else {str+=","+doc_x.value;}
      break;
      case "xgas":
           var flag=0;
           if (doc_x.value==''||isNaN(doc_x.value)){ flag=1; var msg='● 請輸入排氣量數字\n'; }
           else { if (mc=='0') {
                  if ((moca_vk=='01')&&( doc_x.value<=50||doc_x.value>250))
                                                           {flag=1; var msg='● 重型機車排氣量請輸入51~250c.c.(含)之間\n';}
                  if ((moca_vk=='02')&&( doc_x.value>50) ) {flag=1; var msg='● 輕型機車排氣量請輸入50c.c.(含)以下\n';}
                  if ((moca_vk=='32')&&( doc_x.value<250)) {flag=1; var msg='● 大型機車排氣量請輸入251c.c.(含)以上\n';}
                }            }
           if (flag) { $('#xgas').addClass("pdata"); sw=1; err_msg+=msg; }
           else {str+=","+doc_x.value;}
      break;  
      case "xmakyer":
           var flag=0;
           if (doc_m.value==''||doc_c.value==''){ flag=1; var msg='● 請選擇出廠年分\n'; }
           else {
                 var rect = show_today(); dtToday=rect[0]+rect[2]+rect[3];
      	         var mydate = doc_m.value+doc_c.value+'00';
                 if (mydate > dtToday)  { flag=1; var msg='● 出廠日不可以設定今天以後!\n';	}
                }
           if (flag) { $('#xmakyer').addClass("pdata"); sw=1; err_msg+=msg; }
            else {str+=","+doc_m.value+doc_c.value;}  
      break;
      case "xprisda":
           var flag=0;
           if ( doc_m.value==''||doc_c.value==''||doc_d.value=='') { flag=1; var msg='● 請選擇發照日期\n'; }
           else { 
                 var rect = show_today(); dtToday=rect[0]+rect[2]+rect[3];
                 var mydate = (parseInt(doc_m.value)+1911)+doc_c.value+doc_d.value;
                 if (mydate > dtToday) { flag=1; var msg='● 發照日不可以設定今天以後!\n'; }
                 else {   
                       var dt1st = $('#makyer_m').val()+$('#makyer_c').val()+'00';
               	       var dt2nd = (parseInt(doc_m.value)+1911)+doc_c.value+'00';
                       if (dt1st > dt2nd)   { flag=1; var msg='● 發照日不可以比出廠日早!\n'; }
                }     }
           if (flag) { $('#xprisda').addClass("pdata"); sw=1; err_msg+=msg; }
           else {str+=","+doc_m.value+doc_c.value+doc_d.value;}	
      break;
      case "xaefdat":
           var flag=0;
           if ( doc_m.value==''||doc_c.value==''||doc_d.value=='') { flag=1; var msg='● 請選擇保單起保日\n'; }
           else {
                 var rect = show_today(); dtToday=rect[0]+rect[2]+rect[3];
                 var mydate = (parseInt(doc_m.value)+1911)+doc_c.value+doc_d.value;
                 if (mydate < dtToday)   { flag=1; var msg='● 起保日不可以設定今天以前!\n'; }
                }
           if (flag) { $('#xaefdat').addClass("pdata"); sw=1; err_msg+=msg; }
           else {str+=","+doc_m.value+doc_c.value+doc_d.value;}
      break;
// --------------------------------------------------------------------------------------------------- //
      case "xpaytype":
           if(!doc_m.checked&&!doc_c.checked&&!doc_d.checked) {
                  $('#s4I1,#s4I2,#s4I3').addClass("pdata");sw=1; err_msg+='● 請選一種繳費方式\n'; }
           else { var atmno = "[no_atm_num]";
                  if (doc_m.checked)  val=doc_m.value+',2,1,1';
                  
                  if (doc_c.checked){ val=doc_c.value+',3,0,1';
                      //===========
                      ymdhms=show_today(); ranval=(Math.floor(Math.random()*10));
                      var dayNo=(ymdhms[0]-2000)+ymdhms[2]+ymdhms[3]+ymdhms[5]+ymdhms[6]+ymdhms[7]+ranval;
                      var atmno = atm_num('4103',dayNo);          //alert("ATM_NO = "+atmno);
                      //===========
                                    }
                                    
                  if (doc_d.checked)  val=doc_d.value+',3,1,0';                  
                  str+=","+val+","+atmno; }
      break;
      case "xpaytype4":
           if(!doc_m.checked&&!doc_c.checked&&!doc_d.checked&&!doc_e.checked) {
            $('#s4I1,#s4I2,#s4I3,#s4I4').addClass("pdata");sw=1; err_msg+='● 請選一種繳費方式\n'; }
           else { var atmno="[no_atm_num]";
                  if (doc_m.checked){ val=doc_m.value+',2/1/1/1'; }                  
                  if (doc_c.checked){ val=doc_c.value+',3/0/1/1'; atmno=$('#atmno').val();
                      /**===========
                      ymdhms=show_today(); ranval=(Math.floor(Math.random()*10));
                      var dayNo=(ymdhms[0]-2000)+ymdhms[2]+ymdhms[3]+ymdhms[5]+ymdhms[6]+ymdhms[7]+ranval;
                      var atmno = atm_num('4103',dayNo);                            alert("ATM_NO = "+atmno);
                      //===========**/
                                    }
                  if (doc_d.checked){ val=doc_d.value+',3/1/0/1'; atmno="00026100013000";
                      /**===========
                      ymdhms=show_today(); ranval=(Math.floor(Math.random()*10));
                      var dayNo=(ymdhms[0]-2000)+ymdhms[2]+ymdhms[3]+ymdhms[5]+ymdhms[6]+ymdhms[7]+ranval;
                      var atmno = atm_num('4103',dayNo);                            alert("ATM_NO = "+atmno);
                      //===========**/
                                    }
                  if (doc_e.checked){ val=doc_e.value+',3/1/1/0'; }
                  
                  str+=","+val+","+atmno; }
      break;
// --------------------------------------------------------------------------------------------------- //
      case "xnoitem":
           str+=",--";
      break;
      default:      
           var item=(id[i])?id[i]:"--";
           str+=","+item;
      break;
    }
      }
   if(sw){ alert(err_msg); str=''; return str; }
   else { str+='"'; return str;}
}
//------------------------------------------------------------------------------------------ //
//                            這是算出XX(台新)銀行給的ATM虛擬轉帳帳號
// mid=網路會員代號(4碼)  num=10碼(不可重復)
function atm_num(mid,num) {
  var result = "";
  var new_num = num.substr(-9);
	befor = mid + new_num;

	A=befor.substr(0,1)*9;
	B=befor.substr(1,1)*8;
	C=befor.substr(2,1)*7;
	D=befor.substr(3,1)*6;
	E=befor.substr(4,1)*5;
	F=befor.substr(5,1)*4;
	G=befor.substr(6,1)*3;
	H=befor.substr(7,1)*2;
	I=befor.substr(8,1)*1;
	J=befor.substr(9,1)*9;
	K=befor.substr(10,1)*8;
	L=befor.substr(11,1)*7;
	M=befor.substr(12,1)*6;
  var sum = A+B+C+D+E+F+G+H+I+J+K+L+M;
  result = befor + (10-(String(sum).substr(-1)));
	return result;
}
//================郵遞區號/縣市區鄉鎮地名==== for zip code begin =========================== //
//
County = new Array("台北市","基隆市","新北市","宜蘭縣","新竹市","新竹縣","桃園縣","苗栗縣","台中市","彰化縣","南投縣","嘉義市","嘉義縣","雲林縣","台南市","高雄市","澎湖縣","屏東縣","台東縣","花蓮縣","金門縣","連江縣","南海諸島","外國");//全省各縣市 

ZipCode = new Array(24); 
ZipCode[0]  = new Array("100","103","104","105","106","108","110","111","112","114","115","116");//台北市 
ZipCode[1]  = new Array("200","201","202","203","204","205","206");//基隆市 
ZipCode[2]  = new Array("207","208","220","221","222","223","224","226","227","228","231","232","233","234","235","236","237","238","239","241","242","243","244","247","248","249","251","252","253");// 新北市 
ZipCode[3]  = new Array("260","261","262","263","264","265","266","267","268","269","270","272","290");//宜蘭縣 
ZipCode[4]  = new Array("300");//新竹市 
ZipCode[5]  = new Array("302","303","304","305","306","307","308","310","311","312","313","314","315");//新竹縣 
ZipCode[6]  = new Array("320","324","325","326","327","328","330","333","334","335","336","337","338");//桃園縣 
ZipCode[7]  = new Array("350","351","352","353","354","356","357","358","360","361","362","363","364","365","366","367","368","369");//苗栗縣 
ZipCode[8]  = new Array("400","401","402","403","404","406","407","408","411","412","413","414","420","421","422","423","424","426","427","428","429","432","433","434","435","436","437","438","439");//台中市 
ZipCode[9]  = new Array("500","502","503","504","505","506","507","508","509","510","511","5112","513","514","515","516","520","521","522","523","524","525","526","527","528","530");//彰化縣 
ZipCode[10] = new Array("540","541","542","544","545","546","551","552","553","555","556","557","558");//南投縣 
ZipCode[11] = new Array("600");//嘉義市 
ZipCode[12] = new Array("602","603","604","605","606","607","608","611","612","613","614","615","616","621","622","623","624","625");//嘉義縣 
ZipCode[13] = new Array("630","631","632","633","634","635","636","637","638","640","643","646","647","648","649","651","652","653","654","655");//雲林縣 
ZipCode[14] = new Array("700","701","702","704","708","709","710","711","712","713","714","715","716","717","718","719","720","721","722","723","724","725","726","727","730","731","732","733","734","735","736","737","741","742","743","744","745");//台南市 
ZipCode[15] = new Array("800","801","802","803","804","805","806","807","811","812","813","814","815","820","821","822","823","824","825","826","827","828","829","830","831","832","833","840","842","843","844","845","846","847","848","849","851","852");//高雄市 
ZipCode[16] = new Array("880","881","882","883","884","885");//澎湖縣 
ZipCode[17] = new Array("900","901","902","903","904","905","906","907","908","909","911","912","913","920","921","922","923","924","925","926","927","928","929","931","932","940","941","942","943","944","945","946","947");//屏東縣 
ZipCode[18] = new Array("950","951","952","953","954","955","956","957","958","959","961","962","963","964","965","966"); 
ZipCode[19] = new Array("970","971","972","973","974","975","976","977","978","979","981","982","983");//花蓮縣 
ZipCode[20] = new Array("890","891","892","893","894","896");//金門縣 
ZipCode[21] = new Array("209","210","211","212");//連江縣 
ZipCode[22] = new Array("817","819");//南海諸島 
ZipCode[23] = new Array("");//外國

Zone = new Array(24); 
Zone[0]  = new Array("中正區","大同區","中山區","松山區","大安區","萬華區","信義區","士林區","北投區","內湖區","南港區","文山區");//台北市 
Zone[1]  = new Array("仁愛區","信義區","中正區","中山區","安樂區","暖暖區","七堵區");//基隆市 
Zone[2]  = new Array("萬里區","金山區","板橋區","汐止區","深坑區","石碇區","瑞芳區","平溪區","雙溪區","貢寮區","新店區","坪林區","烏來區","永和區","中和區","土城區","三峽區","樹林區","鶯歌區","三重區","新莊區","泰山區","林口區","蘆洲區","五股區","八里區","淡水區","三芝區","石門區");//新北市 
Zone[3]  = new Array("宜蘭市","頭城鎮","礁溪鄉","壯圍鄉","員山鄉","羅東鎮","三星鄉","大同鄉","五結鄉","冬山鄉","蘇澳鎮","南澳鄉","釣魚台列嶼");//宜蘭縣 
Zone[4]  = new Array("");//新竹市 
Zone[5]  = new Array("竹北市","湖口鄉","新豐鄉","新埔鄉","關西鎮","芎林鄉","寶山鄉","竹東鎮","五峰鄉","橫山鄉","尖石鄉","北埔鄉","峨嵋鄉");//新竹縣 
Zone[6]  = new Array("中壢市","平鎮","龍潭鄉","楊梅鎮","新屋鄉","觀音鄉","桃園市","龜山鄉","八德市","大溪鎮","復興鄉","大園鄉","蘆竹鄉");//桃園縣 
Zone[7]  = new Array("竹南鎮","頭份鎮","三灣鄉","南庄鄉","獅潭鄉","後龍鎮","通霄鎮","苑裡鎮","苗栗市","造橋鄉","頭屋鄉","公館鄉","大湖鄉","泰安鄉","鉰鑼鄉","三義鄉","西湖鄉","卓蘭鄉");//苗栗縣 
Zone[8]  = new Array("中區","東區","南區","西區","北區","北屯區","西屯區","南屯區","太平區","大里區","霧峰區","烏日區","豐原區","后里區","石岡區","東勢區","和平區","新社區","潭子區","大雅區","神岡區","大肚區","沙鹿區","龍井區","梧棲區","清水區","大甲區","外圃區","大安區");//台中市 
Zone[9]  = new Array("彰化市","芬園鄉","花壇鄉","秀水鄉","鹿港鎮","福興鄉","線西鄉","和美鎮","伸港鄉","員林鎮","社頭鄉","永靖鄉","埔心鄉","溪湖鎮","大村鄉","埔鹽鄉","田中鎮","北斗鎮","田尾鄉","埤頭鄉","溪州鄉","竹塘鄉","二林鎮","大城鄉","芳苑鄉","二水鄉");//彰化縣 
Zone[10] = new Array("南投市","中寮鄉","草屯鎮","國姓鄉","埔里鎮","仁愛鄉","名間鄉","集集鄉","水里鄉","魚池鄉","信義鄉","竹山鎮","鹿谷鄉");//南投縣 
Zone[11] = new Array("");//嘉義市 
Zone[12] = new Array("番路鄉","梅山鄉","竹崎鄉","阿里山鄉","中埔鄉","大埔鄉","水上鄉","鹿草鄉","太保市","朴子市","東石鄉","六腳鄉","新港鄉","民雄鄉","大林鎮","溪口鄉","義竹鄉","布袋鎮");//嘉義縣 
Zone[13] = new Array("斗南市","大埤鄉","虎尾鎮","土庫鎮","褒忠鄉","東勢鄉","台西鄉","崙背鄉","麥寮鄉","斗六市","林內鄉","古坑鄉","莿桐鄉","西螺鎮","二崙鄉","北港鎮","水林鄉","口湖鄉","四湖鄉","元長鄉");//雲林縣 
Zone[14] = new Array("中西區","東區","南區","北區","安平區","安南區","永康區","歸仁區","新化區","左鎮區","玉井區","楠西區","南化區","仁德區","關廟區","龍崎區","官田區","麻豆區","佳里區","西港區","七股區","將軍區","學甲區","北門區","新營區","後壁區","白河區","東山區","六甲區","下營區","柳營區","鹽水區","善化區","大內區","山上區","新市區","安定區");//台南市 
Zone[15] = new Array("新興區","前金區","苓雅區","鹽埕區","鼓山區","旗津區","前鎮區","三民區","楠梓區","小港區","左營區","仁武區","大社區","岡山區","路竹區","阿蓮區","田寮區","燕巢區","橋頭區","梓官區","彌陀區","永安區","湖內區","鳳山區","大寮區","林園區","鳥松區","大樹區","旗山區","美濃區","六龜區","內門區","杉林區","甲仙區","桃源區","那瑪夏區","茂林區","茄萣區");//高雄市 
Zone[16] = new Array("馬公市","西嶼鄉","望安鄉","七美鄉","白沙鄉","湖西鄉");//澎湖縣 
Zone[17] = new Array("屏東市","三地門鄉","霧台鄉","瑪家鄉","九如鄉","里港鄉","高樹鄉","鹽埔鄉","長治鄉","麟洛鄉","竹田鄉","內埔鄉","萬丹鄉","潮州鎮","泰武鄉","來義鄉","萬巒鄉","嵌頂鄉","新埤鄉","南州鄉","林邊鄉","東港鎮","琉球鄉","佳冬鄉","新園鄉","枋寮鄉", "枋山鄉","春日鄉","獅子鄉","車城鄉","牡丹鄉","恆春鎮","滿州鄉");//屏東縣 
Zone[18] = new Array("台東市","綠島鄉","蘭嶼鄉","延平鄉","卑南鄉","鹿野鄉","關山鎮","海端鄉","池上鄉","東河鄉","成功鄉","長濱鄉","太麻里鄉","金峰鄉","大武鄉","達仁鄉");//台東縣 
Zone[19] = new Array("花蓮市","新城鄉","秀林鄉","吉安鄉","壽豐鄉","鳳林鎮","光復鄉","豐濱鄉","瑞穗鄉","萬榮鄉","玉里鎮","卓溪鄉","富里鄉");//花蓮縣 
Zone[20] = new Array("金沙鎮","金湖鎮","金寧鄉","金城鎮","烈嶼鄉","烏坵鄉");//金門縣
Zone[21] = new Array("南竿鄉","北竿鄉","莒光鄉","東引");//連江縣
Zone[22] = new Array("東沙","南沙");//南海諸島
Zone[23] = new Array("");//外國

// ----------------------------------------------------------------------------------- // 
/*function initCounty(countyInput)
{ 
  countyInput.length = County.length; 
  for (i = 0; i < County.length; i++)
  { 
    countyInput.options[i].value = County[i]; 
    countyInput.options[i].text  = County[i]; 
  } 
  countyInput.selectedIndex = 0; 
} 
// ----------------------------------------------------------------------------------- // 
function initZone(countyInput, zoneInput, post)
{ changeZone(countyInput, zoneInput, post); }
// -------------------郵遞區號 轉 地名------------------------------------------------ //
function showZone1(post)
{  for (i=0; i < ZipCode.length; i++)
  { for (j=0; j < ZipCode[i].length; j++)
    { if ( post == ZipCode[i][j] ) { document.write(County[i]+Zone[i][j]);return; } } 
  } 
}*/
// ----------------------------------------------------------------------------------- // 
function showZone(countyInput,zoneInput,post)
{ 
  var k=0;l=0; 
  for (i=0; i < ZipCode.length; i++)
  { 
    for (j=0; j < ZipCode[i].length; j++)
    { 
      if ( post == ZipCode[i][j] )
      { 
        countyInput.length = County.length; 
        for (k = 0; k < countyInput.length; k++)
        { 
          countyInput.options[k].value = County[k]; 
          countyInput.options[k].text  = County[k]; 
          if (County[k] == County[i]) { countyInput.options[k].selected = true; } 
        } 
        
        zoneInput.length = Zone[i].length; 
        for (l = 0; l < zoneInput.length; l++)
        { 
          zoneInput.options[l].value = Zone[i][l]; 
          zoneInput.options[l].text = Zone[i][l]; 
          if (zoneInput.options[l].text == Zone[i][j]) { zoneInput.options[l].selected = true; } 
        } 
        return; 
      } 
    } 
  } 
  // alert(k+'無此郵遞區號'+l);post='100';ResetAll();return; 
}
// ----------------------------------------------------------------------------------- //
function changeZone(countyInput, zoneInput, post)
{ 
  selectedCountyIndex = countyInput.selectedIndex; 
  
  zoneInput.length = Zone[selectedCountyIndex].length; 
  for (i = 0; i < Zone[selectedCountyIndex].length; i++)
  { 
    zoneInput.options[i].value = Zone[selectedCountyIndex][i]; 
    zoneInput.options[i].text = Zone[selectedCountyIndex][i]; 
    if (zoneInput.options[i].text == "中正區") zoneInput.options[i].selected = true; 
  } 
  //zoneInput.selectedIndex = 0; 
  
  showZipCode(countyInput, zoneInput, post); 
}
// ----------------------------------------------------------------------------------- //
function showZipCode(countyInput, zoneInput, post)
{   post.value = ZipCode[countyInput.selectedIndex][zoneInput.selectedIndex]; }
//=========================== for zip code end ======================================= //
//=========================== sessionStorage access sample =========================== //
function saveStorage_S(id)
{
    var target=document.getElementById(id);
    var str=target.value;
    sessionStorage.setItem(id+'_var',str);
}
function loadStorage_S(id)
{
    var msg=sessionStorage.getItem(id+"_var");
    return msg;
}