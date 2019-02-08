<?php

namespace App\Repositories\StudentApply;

interface StudentApplyInterface
{

    public function create($studentApply);

    public function getLastStudentId();

    public function all();

    public function search($data);

    public function searchPrintList($data);

    public function findById($id);

    public function findByInvoiceNo($applyId, $invoiceId);

    public function findByApplyNo($id);

    public function findByEditId($id);

    public function insertArray($studentApplyArray);

    public function exportData();

    public function findBykey($key);

    public function getColumns();

    public function exportSearch($data);

    public function exportClassList($data);

    public function exportPickupList($data);

    public function getGradList($gradFrom,$gradCampus);

    public function getChangeDorm($changeFrom,$changeTo,$campus);

    public function getChangeHotel($changeFrom,$changeTo,$campus);

    public function getChangePlan($changePlanFrom,$changePlanTo,$campus);

    public function getCountPerCountry($countryCode);

    public function getPlanList($countPlanFrom,$countPlanTo,$countPlanCampus,$countCntCode);

    public function getCafeListDorm($cafeFrom,$cafeTo,$cafeCampus,$visitorType);

    public function getCafeListOthers($cafeFrom,$cafeTo,$cafeCampus,$visitorType,$accommodationId);

    public function getSalesReportStudents($date,$country,$agent);

    public function getSumOfStudents($date);

    public function getSalesReportStudentWeeks($date,$country,$agent);

    public function getSumOfStudentsWeek($date);

    public function getWeeklyListStudentReport($searchCondition);

    public function getAgenciesCamps($campFrom,$campTo,$campus,$visitId);

    public function getChangeHotels($changeFrom,$changeTo,$campus);

    public function getChangeWalkins($changeFrom,$changeTo,$campus);

    public function getChangeCondos($changeFrom,$changeTo,$campus);

    public function getTotalNumberOfTermsPerMonthPerNation($searchCondition);

    public function getTotalNumberOfStudentsPerWeek($searchCondition);

    public function getTotalNumberOfTransferStudentsPerWeek($searchCondition);

}