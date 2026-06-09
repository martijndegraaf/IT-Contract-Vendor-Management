require('dotenv').config({ path: require('path').join(__dirname, '../pvsp-backend/.env') })
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

async function seed(){
  const { data: vendors } = await supabase.from('vendors').select('id, name')
  const vid = {}
  vendors.forEach(function(v){ vid[v.name] = v.id })

  const contracts = [
    { vendor_id:vid['Atos'], contract_ref:'CON-2024-AT-001', title:'Mainframe Management Belastingdienst', type:'sla', status:'active', start_date:'2022-01-01', end_date:'2025-09-01', value:2800000, annual_value:933333, notice_days:90, renewal_type:'manual', signed:true, legal_entity:'Min. Financien', domain:'Belastingdienst', beleidsveld:'Bedrijfsvoering', bekostiging:'Output-based SLA', indexatie:'Annually CBS CPI' },
    { vendor_id:vid['Atos'], contract_ref:'CON-2024-AT-002', title:'Cloud Migratie Dienstverlening', type:'inkoop', status:'active', start_date:'2023-06-01', end_date:'2025-09-01', value:900000, annual_value:450000, notice_days:60, renewal_type:'one-off', signed:true, legal_entity:'Min. Financien', domain:'Belastingdienst', beleidsveld:'Bedrijfsvoering', bekostiging:'Inspanningsgericht', indexatie:'Vaste prijs' },
    { vendor_id:vid['Atos'], contract_ref:'CON-2024-AT-003', title:'Cybersecurity Monitoring', type:'sla', status:'active', start_date:'2024-01-01', end_date:'2025-09-01', value:500000, annual_value:500000, notice_days:30, renewal_type:'automatic', signed:true, legal_entity:'Min. Financien', domain:'Belastingdienst', beleidsveld:'Informatiebeveiliging', bekostiging:'Output-based SLA', indexatie:'Annually CBS CPI' },
    { vendor_id:vid['Capgemini'], contract_ref:'CON-2024-CAP-001', title:'Applicatiebeheer RVO Portaal', type:'sla', status:'renewal', start_date:'2023-03-15', end_date:'2026-03-15', value:4200000, annual_value:1400000, notice_days:180, renewal_type:'manual', signed:true, legal_entity:'RVO / Min. EZK', domain:'RVO', beleidsveld:'Subsidies en Vergunningen', bekostiging:'Inspanningsgericht', indexatie:'Annually CBS CPI' },
    { vendor_id:vid['Capgemini'], contract_ref:'CON-2024-CAP-002', title:'DevOps Platform Dienstverlening', type:'inkoop', status:'active', start_date:'2022-07-01', end_date:'2026-03-15', value:2800000, annual_value:700000, notice_days:90, renewal_type:'manual', signed:true, legal_entity:'RVO / Min. EZK', domain:'RVO', beleidsveld:'Subsidies en Vergunningen', bekostiging:'Taakgericht', indexatie:'Annually CBS CPI' },
    { vendor_id:vid['Capgemini'], contract_ref:'CON-2024-CAP-003', title:'API Gateway Management', type:'sla', status:'active', start_date:'2023-01-01', end_date:'2026-03-15', value:750000, annual_value:250000, notice_days:60, renewal_type:'automatic', signed:true, legal_entity:'RVO / Min. EZK', domain:'RVO', beleidsveld:'Digitale Infrastructuur', bekostiging:'Output-based SLA', indexatie:'Vaste prijs' },
    { vendor_id:vid['Cegeka'], contract_ref:'CON-2023-CEG-001', title:'DUO Studentenadministratie Platform', type:'sla', status:'active', start_date:'2021-01-01', end_date:'2025-12-31', value:3200000, annual_value:800000, notice_days:120, renewal_type:'manual', signed:true, legal_entity:'DUO / Min. OCW', domain:'DUO', beleidsveld:'Onderwijs en Onderzoek', bekostiging:'Output-based SLA', indexatie:'Annually CBS CPI' },
    { vendor_id:vid['Sopra Steria'], contract_ref:'CON-2024-SOG-001', title:'CJIB Boetesysteem Beheer', type:'sla', status:'active', start_date:'2022-04-01', end_date:'2026-06-30', value:1800000, annual_value:450000, notice_days:90, renewal_type:'manual', signed:true, legal_entity:'CJIB / Min. JenV', domain:'CJIB', beleidsveld:'Handhaving', bekostiging:'Output-based SLA', indexatie:'Annually CBS CPI' },
    { vendor_id:vid['Sopra Steria'], contract_ref:'CON-2024-SOG-002', title:'Data Analytics Platform', type:'inkoop', status:'active', start_date:'2023-09-01', end_date:'2026-06-30', value:600000, annual_value:200000, notice_days:60, renewal_type:'automatic', signed:true, legal_entity:'CJIB / Min. JenV', domain:'CJIB', beleidsveld:'Informatiemanagement', bekostiging:'Inspanningsgericht', indexatie:'Vaste prijs' },
    { vendor_id:vid['PinkRoccade'], contract_ref:'CON-2024-PR-001', title:'Gemeentelijk Belastingsysteem', type:'sla', status:'active', start_date:'2020-01-01', end_date:'2025-06-30', value:5600000, annual_value:1120000, notice_days:180, renewal_type:'manual', signed:true, legal_entity:'Gemeenten', domain:'Gemeenten', beleidsveld:'Belastingen', bekostiging:'Output-based SLA', indexatie:'Annually CBS CPI' },
    { vendor_id:vid['PinkRoccade'], contract_ref:'CON-2024-PR-002', title:'Burgerzaken Applicatie Suite', type:'sla', status:'active', start_date:'2021-06-01', end_date:'2025-06-30', value:2400000, annual_value:600000, notice_days:120, renewal_type:'manual', signed:true, legal_entity:'Gemeenten', domain:'Gemeenten', beleidsveld:'Burgerzaken', bekostiging:'Taakgericht', indexatie:'Annually CBS CPI' },
  ]

  await supabase.from('contracts').delete().neq('id', 0)
  const { data, error } = await supabase.from('contracts').insert(contracts).select()
  if(error){ console.error('Error:', error.message) }
  else { console.log('Seeded ' + data.length + ' contracts successfully!') }
}

seed()
