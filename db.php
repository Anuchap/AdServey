<?php 
date_default_timezone_set('Asia/Bangkok');
require 'Classes/rb.php';
R::setup('mysql:host=localhost;dbname=adservey2', 'root', '');
//R::setup('mysql:host=mysql.hostinger.in.th;dbname=u259355923_ad', 'u259355923_ad', 'P@ssw0rd');

class Db {
	public static function getFileName($uid) {
		return  R::getCell('select filename from log where uid = ? order by id desc limit 1', [$uid]);
	}
    
    public static function getStatus($uid) {
        return R::getCell('select status from log where uid = ? order by id desc limit 1', [$uid]);
    }
	
	public static function writeLog($uid, $fileName, $status) {
		if($status == 'uploaded') {
			$id = R::getCell('select id from log where uid = ? and status = "started" order by id desc limit 1', [$uid]);
			$l = R::load('log', $id);
			$l->filename = $fileName;
			R::store($l);
		}
		
		$log = R::dispense('log');
		$log->uid = $uid;
		$log->datetime = new DateTime();
		$log->filename = $fileName;
		$log->status = $status;
		return R::store($log); 
	}
	
	public static function sendAnswer($uid, $qno, $answer, $optional) {
		$id = R::getCell('select id from answer where uid = ? and qno = ? order by id desc limit 1', [$uid, $qno]);
		
		if(empty($id)) {
			$ans = R::dispense('answer');
			$ans->uid = $uid;
			$ans->datetime = new DateTime();
			$ans->qno = $qno;
			$ans->answer = $answer;
			$ans->optional = $optional;
			return R::store($ans);
		} else {
			$ans = R::load('answer', $id);
			$ans->answer = $answer;
			$ans->optional = $optional;
			return R::store($ans);
		}
	}
}
?>
