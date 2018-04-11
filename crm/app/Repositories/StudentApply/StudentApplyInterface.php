<?php

namespace App\Repositories\StudentApply;

interface StudentApplyInterface
{

    public function create($studentApply);

    public function all();

    public function search($data);

    public function findById($id);

    public function findByInvoiceNo($id);

    public function findByApplyNo($id);

    public function findByEditId($id);

    public function insertArray($studentApplyArray);

    public function exportData();

    public function findBykey($key);

    public function getColumns();

    public function exportSearch($data);

    public function getGradList($gradFrom,$gradCampus);

    public function getChangeDorm($changeFrom);

    public function getChangeHotel($changeFrom);


}