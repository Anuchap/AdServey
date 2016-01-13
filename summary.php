<?php
require_once 'Classes/PHPExcel.php';
include 'Classes/PHPExcel/IOFactory.php';
require_once 'db.php';
require_once 'cellconfig.php';

$fileName = Db::getFileName($_GET['uid']);
$inputFileName = 'uploads/' . $fileName;  

if(!is_file($inputFileName)) {
	echo 'FILE_NOT_FOUND';
	exit;
}

$inputFileType = PHPExcel_IOFactory::identify($inputFileName);  
$objReader = PHPExcel_IOFactory::createReader($inputFileType);  
$objReader->setReadDataOnly(true);  
$objPHPExcel = $objReader->load($inputFileName);  

$objWorksheet15 = $objPHPExcel->setActiveSheetIndex(2);
$objWorksheet16 = $objPHPExcel->setActiveSheetIndex(3);

$list = array();
for ($i = 3; $i <= 278; $i+=5) {
	$total15 = $objWorksheet15->getCell('AI'.$i)->getCalculatedValue();
	$total16 = $objWorksheet16->getCell('AI'.$i)->getCalculatedValue();
	
	if($total15 == 0 && $total16 == 0) continue;
	
	$industry = new StdClass;
	$industry->name = $objWorksheet15->getCell('A'.$i)->getValue();
	
	// 2015
	$industry->y15 = new StdClass;
	$industry->y15->total = $total15;
	$industry->y15->disciplines = getDisciplines($cellConfig, $objWorksheet15, $i);
	
	// 2016
	$industry->y16 = new StdClass;
	$industry->y16->total = $total16;
	$industry->y16->disciplines = getDisciplines($cellConfig, $objWorksheet16, $i);
	
	$list[] = $industry;
}

function getDisciplines($cellConfig, $objWorksheet, $i) {
	$disciplines = array();
	
	foreach ($cellConfig as $c) {
		$discipline = new StdClass;
		$discipline->name = explode("\n", $objWorksheet->getCell($c->totalCell . '1')->getValue())[0];
		$discipline->value = $objWorksheet->getCell($c->totalCell . $i)->getValue();
		$discipline->isvalid = true;
		$discipline->type = $c->percentType;
		$discipline->detail = new StdClass;
		
		// find detail
		switch($discipline->type) {
			case 1: // { direct: 10, adnetwork: 20, programetic: 70, isvalid: true }
				$discipline->detail->direct = $objWorksheet->getCell($c->detailCells->direct . ($i + 2))->getValue() * 100;
				$discipline->detail->adnetwork = $objWorksheet->getCell($c->detailCells->adnetwork . ($i + 2))->getValue() * 100;
				$discipline->detail->programetic = $objWorksheet->getCell($c->detailCells->programetic . ($i + 2))->getValue() * 100;
				$discipline->detail->isvalid = $discipline->value == 0 
					|| ($discipline->detail->direct + $discipline->detail->adnetwork + $discipline->detail->programetic) == 100; 
			break;
			case 2: // { display: { value: 50, isvalid: true, level2: { desktop: 10, mobile: 90, isvalid: true } }, video: { value: 50, isvalid: true, level2: { desktop: 60, mobile: 40, isvalid: true } } }
				$discipline->detail->display = new StdClass;
				$discipline->detail->display->value = $objWorksheet->getCell($c->detailCells->display->cell . ($i + 2))->getValue() * 100;
				$discipline->detail->display->level2 = new StdClass;
				$discipline->detail->display->level2->desktop = $objWorksheet->getCell($c->detailCells->display->desktop . ($i + 4))->getValue() * 100;
				$discipline->detail->display->level2->mobile = $objWorksheet->getCell($c->detailCells->display->mobile . ($i + 4))->getValue() * 100;
				$discipline->detail->display->level2->isvalid = $discipline->detail->display->value == 0 
					|| ($discipline->detail->display->level2->desktop + $discipline->detail->display->level2->mobile) == 100; 
				
				$discipline->detail->video = new StdClass;
				$discipline->detail->video->value = $objWorksheet->getCell($c->detailCells->video->cell . ($i + 2))->getValue() * 100;
				$discipline->detail->video->level2 = new StdClass;
				$discipline->detail->video->level2->desktop = $objWorksheet->getCell($c->detailCells->video->desktop . ($i + 4))->getValue() * 100;
				$discipline->detail->video->level2->mobile = $objWorksheet->getCell($c->detailCells->video->mobile . ($i + 4))->getValue() * 100;
				$discipline->detail->video->level2->isvalid = $discipline->detail->video->value == 0 
					|| ($discipline->detail->video->level2->desktop + $discipline->detail->video->level2->mobile) == 100; 
				
				$discipline->detail->display->isvalid = $discipline->value == 0 
					|| ($discipline->detail->display->value + $discipline->detail->video->value) == 100;
				$discipline->detail->video->isvalid = $discipline->detail->display->isvalid;
			break;
			case 3: // { display: 10, video: 90, isvalid: true }
				$discipline->detail->display = $objWorksheet->getCell($c->detailCells->display . ($i + 2))->getValue() * 100;
				$discipline->detail->video = $objWorksheet->getCell($c->detailCells->video . ($i + 2))->getValue() * 100;
				$discipline->detail->isvalid = $discipline->value == 0 
					|| ($discipline->detail->display + $discipline->detail->video) == 100; 
			break;
			case 4: // { video: 10, banner: 20, social: 70, isvalid: true }
				$discipline->detail->video = $objWorksheet->getCell($c->detailCells->video . ($i + 2))->getValue() * 100;
				$discipline->detail->banner = $objWorksheet->getCell($c->detailCells->banner . ($i + 2))->getValue() * 100;
				$discipline->detail->social = $objWorksheet->getCell($c->detailCells->social . ($i + 2))->getValue() * 100;
				$discipline->detail->isvalid = $discipline->value == 0 
					|| ($discipline->detail->video + $discipline->detail->banner + $discipline->detail->social) == 100; 
			break;
		}
		
		// verify
		if($c->totalCell == 'K') {
			$percent = $objWorksheet->getCell($c->percentCell . ($i + 2))->getCalculatedValue();
			$discipline->isvalid = ($discipline->value == 0) ? ($percent == 0) : ($percent == 1);
			
			if($discipline->isvalid) {
				$value = $objWorksheet->getCell('K' . ($i + 2))->getValue();
				$percent = $objWorksheet->getCell('M' . ($i + 4))->getCalculatedValue();
				$discipline->isvalid = ($value == 0) ? ($percent == 0) : ($percent == 1);
				
				if($discipline->isvalid) {
					$value = $objWorksheet->getCell('N' . ($i + 2))->getValue();
					$percent = $objWorksheet->getCell('P' . ($i + 4))->getCalculatedValue();
					$discipline->isvalid = ($value == 0) ? ($percent == 0) : ($percent == 1);
				}
			}
		} else if($c->totalCell == 'Q') {
			$percent = $objWorksheet->getCell($c->percentCell . ($i + 2))->getCalculatedValue();
			$discipline->isvalid = ($discipline->value == 0) ? ($percent == 0) : ($percent == 1);
			
			if($discipline->isvalid) {
				$value = $objWorksheet->getCell('Q' . ($i + 2))->getValue();
				$percent = $objWorksheet->getCell('S' . ($i + 4))->getCalculatedValue();
				$discipline->isvalid = ($value == 0) ? ($percent == 0) : ($percent == 1);
				
				if($discipline->isvalid) {
					$value = $objWorksheet->getCell('T' . ($i + 2))->getValue();
					$percent = $objWorksheet->getCell('V' . ($i + 4))->getCalculatedValue();
					$discipline->isvalid = ($value == 0) ? ($percent == 0) : ($percent == 1);
				}
			}
		} else if($c->percentCell != null) {
			$percent = $objWorksheet->getCell($c->percentCell . ($i + 2))->getCalculatedValue();
			$discipline->isvalid = ($discipline->value == 0) ? ($percent == 0) : ($percent == 1);
		}
		
		$disciplines[] = $discipline;
	}
	
	return $disciplines;
}

// header('Content-type: text/html;charset=utf-8');
// var_dump($list);

header('Content-type: application/json;charset=utf-8');
echo json_encode($list, JSON_UNESCAPED_UNICODE );

?>
