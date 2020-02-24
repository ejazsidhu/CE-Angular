import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ModalDirective } from 'ngx-bootstrap';
import { config } from 'src/assets/config';

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss']
})
export class ShopDetailComponent implements OnInit {
  title = 'shop list';
  tableData: any = [];
  loading = false;
  // ip= environment.ip
  configFile = config;

  ip: any = "http://nflcensus.concavetech.com/";//this.configFile.ip;
  remarksId: any = 0;

  @ViewChild('childModal') childModal: ModalDirective;
  selectedItem: any = {};
  tableTitle = '';



  constructor(private router: Router, private httpService: DashboardService, public activatedRoute: ActivatedRoute) {

    this.activatedRoute.params.subscribe(p=>{
      console.log("params",p)
    })


   }
   showChildModal(): void {
    this.childModal.show();
  }
  goToEvaluation(id) {
  window.open(`${environment.hash}dashboard/evaluation/list/details/${id}?location=shop`, '_blank');
  }
  hideChildModal(): void {
    this.childModal.hide();
  }

  setSelectedItem(item) {
    this.selectedItem = item;

  }
  ngOnInit() {

    let id = 0;
    const o: any = JSON.parse(localStorage.getItem('obj'));
    console.log(o);

    this.activatedRoute.queryParams.subscribe(p => {
      this.remarksId = p.remark_id;
    });
    this.activatedRoute.params.subscribe(p => {
      id = p.id;
      const obj = {
      
        startDate: p.startDate,
        endDate: p.endDate,
        surveyorId: id,
     
      };

      this.getTableData(obj);
    });
    if (this.remarksId === 1) {
    this.tableTitle = 'Successful';
    } else if (this.remarksId === -1) {
    this.tableTitle = 'Completed';
         } else if (this.remarksId === 0) {
    this.tableTitle = 'Un-Successful';
         }

  }
  getTableData(obj) {
    this.loading = true;
    this.httpService.getCEShopData(obj).subscribe(data => {
      console.log(data, 'table data single shop');
      const res: any = data;
      // this.dataSource = res;
      if (res != null) {
      this.tableData = res.shopList;
      }
      this.loading = false;
      // if (res.planned == 0)
      //   this.toastr.info('No data available for current selection', 'Summary')
    }, error => {
      console.log(error, 'home error');

    });
  }

  getPdf(item) {
    // debugger
    const obj = {
      surveyId: item.surveyId,
      type: 25,
      shopName: item.shopName
    };
    const url = 'url-pdf';
    this.httpService.DownloadResource(obj, url);

  }
}
