<?php
 /** <-- ---------------------------------------------- conn.php start ------------------------------------------------ --> **/
/* function ob_gzip($content) // $content 就是要壓縮的頁面內容，或者說餅幹原料
{   
    if(    !headers_sent() && // 如果頁面頭部信息還沒有輸出
        extension_loaded("zlib") && // 而且zlib擴展已經加載到PHP中
        strstr($_SERVER["HTTP_ACCEPT_ENCODING"],"gzip")) //而且瀏覽器說它可以接受GZIP的頁面
    {
       $content = gzencode($content,9); //為準備壓縮的內容貼上“//此頁已壓縮”的注釋標簽，然後用zlib提供的gzencode()函數執行級別為9的壓縮，這個參數值範圍是0-9，0表示無壓縮，9表示最大壓縮，當然壓縮程度越高越費CPU。
       
        //然後用header()函數給瀏覽器發送一些頭部信息，告訴瀏覽器這個頁面已經用GZIP壓縮過了！ 
        header("Content-Encoding: gzip");
        header("Vary: Accept-Encoding");
        header("Content-Length: ".strlen($content));
    }
    return $content; //返回壓縮的內容，或者說把壓縮好的餅幹送回工作臺。
}
ob_start('ob_gzip');*/

/*ini_set('session.gc_maxlifetime', 0);
ini_set('session.cache_expire', 2);
ini_set('session.cookie_lifetime', 2);*/
 

/* set the cache expire to 30 minutes */
 
 
if (!isset($_SESSION)) {  @session_start(); }

@setcookie("Ticks", '' );
@setcookie("Ticks", 'OK' ,time()+30*60);
# FileName="Connection_php_mysql.htm"
# Type="MYSQL"
# HTTP="true"
/** -- db_conn info -- **/ 
  $db_honame = "localhost";
  $db_dbname = "db_4evers";
  $db_usname = "4evers";
  $db_passwd = "gt676335";
  
  $conn = mysql_connect($db_honame,$db_usname,$db_passwd) or trigger_error(mysql_error(),E_USER_ERROR);
  mysql_select_db($db_dbname);
  mysql_query('SET NAMES UTF8', $conn);
  
  $dbhost = $db_honame;
  $dbname = $db_dbname;
  $dbuser = $db_usname;
  $dbpass = $db_passwd;
  $dbtype  = 'mssql';
/** -- db_func info -- **/ 
  function db_affected_rows()               {return mysql_affected_rows();}
  function db_data_seek($res,$num)          {return mysql_data_seek($res,$num);}
  function db_error()                       {return mysql_error();}
  function db_real_escape_string($param)    {return mysql_real_escape_string($param);}
  function db_fetch_array($res)             {return mysql_fetch_array($res);}
  function db_fetch_assoc($res)             {return mysql_fetch_assoc($res);}
  function db_fetch_object($res)            {return mysql_fetch_object($res);}
  function db_fetch_row($res)               {return mysql_fetch_row($res);}
  function db_insert_id($res)               {return mysql_insert_id($res);}
  function db_num_rows($res)                {return mysql_num_rows($res);}
  function db_query($sqlstr)                {return mysql_query($sqlstr);}
  
  define('DBTYPE', 'mysql');
  define('DEBUG', 0);
  define('GOOGLE', '');                               // Google分析碼
  define('KEY', '');                                  // 關鍵字
  define('FTITLE','Welcome to 安久號─食材商店');      // Title for FrontSite
  define('BTITLE','Welcome to 安久號─後台管理');      // Title for BackEnd
  //define('STITLE','開山儲戶社-夥伴管理系統');       // Title for InsBackEnd
  define('HTTP_IP','websrv.local.tw/forevers/');      // 114.33.140.96/forevers/     hch2.eu5.org
 	define('E4CU','4ever_cusmem');
	define('E4OR','4ever_order');
  define('E4PR','4ever_product');
  
ini_set('safe_mode', 'OFF');  
//include_once(dirname(__FILE__) . '/../includes/sql_db.php');

/** -------------------------------------------------------------------------------------------------------------- **/
  function db_tot_Rno($dbtbl) {   //取得該表資料總數
                $sql    = "SELECT count(*) FROM ".$dbtbl;
                $result = db_query($sql) or die(db_error());
                $data   = db_fetch_row($result); 
                return($data[0]);
              }  
  
  function db_con_lis($dbtbl,$start,$max_items) { //讀出該表資料一覽每頁行數$max_items
                $sql    = "SELECT * FROM ".$dbtbl." LIMIT ".$start.",".$max_items;
//{echo '<pre align="left"><font color="orange">$'.__LINE__ .' ==> ( $start,$max_items ) = ';print_r($start);print_r($max_items);echo '</font></pre>';} 
		            $result = db_query($sql) or die(db_error());
//{echo '<pre align="left"><font color="orange">$'.__LINE__ .' ==> ( $result ) = ';print_r($result);echo '</font></pre>';}
                return($result);
              }
              
  function db_con_upd($dbtbl,$items,$key="id",$id) {  //更新該資料表某筆$id的某些(所有)欄位$items
            //$upd_Order="UPDATE 4ever_Order SET ro_payType='".$_POST['payTp']."',ro_payused='".$pyct."',ro_ATMnum='".$atmno."' WHERE 4ever_Order.id='".$ro_id."'";
                $upd    = "UPDATE ".$dbtbl." SET ".$items." WHERE ".$dbtbl.".".$key." = '".$id."'"; 
                $result = db_query($upd) or die(db_error());
                return($result);
              }
                    
  function db_con_req($dbtbl,$items,$key,$id) {  //讀出該資料表某筆$id的某些(所有)欄位$items
                if    ($id=="all") { $where="ORDER BY ".($key!="")?$key:"id"." ASC"; }
                else if ($key=="") { $where="WHERE ".$dbtbl.".id = ".$id; }
                else               { $where="WHERE ".$dbtbl.".".$key." = '".$id."'";  }
                $qey    = "SELECT ".$items." FROM ".$dbtbl." ".$where;
                //$qey    = "SELECT ".$items." FROM ".$dbtbl." WHERE ".$dbtbl.".".$key." = '".$id."'";
                $result = db_query($qey) or die(db_error());                
                return($result);
              }
/** -------------------------------------------------------------------------------------------------------------- **/  
  function db_4Cu_Ins($vals) { //  寫會員檔    
                $ins_CusMem = "INSERT INTO ".E4CU." ( rm_name,rm_birth_y,rm_birth_m,rm_birth_d,rm_cell,rm_tell,rm_email,rm_pswd,
                rm_country,rm_zip,rm_city,rm_canton,rm_address,rm_fname,rm_fid,rm_joinDate ) ";
                $ins_CusMem.= "VALUES (".$vals.")";
                $Result     = db_query($ins_CusMem) or die(db_error());
                return($result);
              }
  
  function db_4Or_Ins($vals) { //  寫訂單檔
                $ins_Order = "INSERT INTO ".E4OR." ( id,ro_priceDetail,ro_priceT,ro_bonusD,ro_priceD,ro_type,ro_isneed,rm_name,
                rm_birth_y,rm_birth_m,rm_birth_d,rm_cell,rm_tell,rm_email,rm_country,rm_address,rm_fname,rm_fid,ro_name,ro_cell,
                ro_tell,ro_email,ro_country,ro_address,ro_fname,ro_Ddate,ro_Dtime,ro_payType,ro_payused,ro_ATMnum,ro_status,ro_state1Date ) ";
                $ins_Order.= "VALUES (".$vals.")";
                $Result    = db_query($ins_Order) or die(db_error());
                return($result);
              } 
              
   function db_4Pr_Ins($vals) { //  寫商品檔
                $ins_Product = "INSERT INTO ".E4PR." ( id,rp_title,rp_group,rp_subgp,rp_desc,rp_quity,rp_unitPrice,rp_proON,
                rp_startDate,rp_stopDate,rp_pic,rp_detail ) ";
                $ins_Product.= "VALUES (".$vals.")";
                $Result    = db_query($ins_Product) or die(db_error());
                return($result);
              } 
/** -------------------------------------------------------------------------------------------------------------- **/
$_SuperCode = array(
'01_GNT'  => 'giant007',    //簡志安
'02_HSU'  => 'adnilhsu',    //徐建華
'03_TST'  => '12345678',    //測試者
'04_4EV'  => '28676335',    //安久號
);
/** <-- ------------------------------------------- conn.php end ----------------------------------------------------- --> **/
?>